import os
import pymongo
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from dotenv import load_dotenv

dotenv_path = os.path.abspath(".env")
load_dotenv(dotenv_path)

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB", "Boxhead")
MONGODB_COLLECTION = os.getenv("MONGODB_COLLECTION", "statistics")

client = pymongo.MongoClient(MONGODB_URI)
db = client[MONGODB_DB]
collection = db[MONGODB_COLLECTION]

emails_unicos = collection.distinct("email")

output_dir = "images"
os.makedirs(output_dir, exist_ok=True)

for email_filter in emails_unicos:
    data = list(collection.find(
        {"email": email_filter},
        {"kills": 1, "rounds": 1, "createdAt": 1, "totalTime": 1, "wasModificatedMatch": 1, "_id": 0}
    ))

    if not data:
        print(f"No es van trobar dades per a l'email: {email_filter}")
        continue

    df = pd.DataFrame(data)
    df['createdAt'] = pd.to_datetime(df['createdAt'], format='%Y-%m-%d')

    df = df.sort_values(by='createdAt')

    ### --- PRIMERA GRÀFICA --- ###
    df['Total Kills'] = df['kills']
    
    if df['createdAt'].nunique() > 1:
        df['kills_prev'] = df['kills'].shift(1).fillna(0)
        df['Noves Kills'] = np.where(df['kills'] > df['kills_prev'], df['kills_prev'], 0)
        df['kills Reduits'] = np.where(df['kills'] < df['kills_prev'], df['kills_prev'], 0)
    else:
        df['Noves Kills'] = 0
        df['kills Reduits'] = 0

    df_grouped = df.groupby('createdAt').agg({
        'Noves Kills': 'sum',
        'kills Reduits': 'sum',
        'Total Kills': 'sum',
        'wasModificatedMatch': 'max'
    }).reset_index()

    df_grouped['createdAt'] = df_grouped['createdAt'].dt.strftime('%Y-%m-%d')
    df_grouped['DateTagged'] = df_grouped.apply(
        lambda row: row['createdAt'] + (' *' if row['wasModificatedMatch'] else ''), axis=1
    )

    plt.figure(figsize=(12, 6))
    sns.barplot(x="DateTagged", y="Total Kills", data=df_grouped, color='skyblue', label="Total Kills")
    sns.barplot(x="DateTagged", y="Noves Kills", data=df_grouped, color='lightgreen', label="Noves Kills")
    sns.barplot(x="DateTagged", y="kills Reduits", data=df_grouped, color='salmon', label="kills Reduits")

    plt.xlabel("Data")
    plt.ylabel("Kills")
    plt.title(f'Estadístiques de Kills per Data - {email_filter}')
    plt.xticks(rotation=45, ha="right")

    if df_grouped['wasModificatedMatch'].any():
        plt.text(0, -0.1, "* = Partida Modificada", transform=plt.gca().transAxes,
                 fontsize=10, color="black", ha="left", va="bottom")

    email_filter_safe = email_filter.replace("@", "_").replace(".", "_")
    user_output_dir = os.path.join(output_dir, email_filter_safe)
    os.makedirs(user_output_dir, exist_ok=True)

    output_path = os.path.join(user_output_dir, "grafica_kills.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')

    ### --- SEGONA GRÀFICA --- ###
    sns.set_theme(style="ticks")

    df['createdAt_num'] = df['createdAt'].apply(lambda x: pd.Timestamp(x).toordinal())

    g = sns.lmplot(
        data=df, x="createdAt_num", y="rounds", aspect=1.5, order=1, ci=None,
        scatter_kws={"s": 50, "color": "red"}, line_kws={"lw": 2, "color": "blue"}
    )

    g.set_axis_labels("Data", "Rondes")
    g.fig.suptitle(f"Roundes per Data - {email_filter}")

    plt.gca().yaxis.get_major_locator().set_params(integer=True)

    tick_labels = df['createdAt'].dt.strftime('%Y-%m-%d').unique()
    g.set(xticks=df['createdAt_num'].unique(), xticklabels=tick_labels)
    plt.xticks(rotation=45, ha="right")

    for idx, row in df.iterrows():
        if row['wasModificatedMatch']:
            x_pos = row['createdAt_num']
            plt.text(x_pos, row['rounds'] - 0.5, "*", color="black", fontsize=12, ha="center", va="top")

    if df['wasModificatedMatch'].any():
        plt.text(0, -0.1, "* = Partida Modificada", transform=plt.gca().transAxes,
                 fontsize=10, color="black", ha="left", va="bottom")

    output_path_anscombe = os.path.join(user_output_dir, "grafica_rounds.png")
    plt.savefig(output_path_anscombe, dpi=300, bbox_inches='tight')

    ### --- TERCERA GRÁFICA --- ###
    plt.figure(figsize=(12, 6))

    df['totalTime'] = df['totalTime'] / 60

    sns.scatterplot(x="totalTime", y="rounds", data=df, color='blue', s=100, alpha=0.6, edgecolor='black')

    plt.xlabel("Temps total jugat (minuts)")
    plt.ylabel("Rondes")
    plt.title(f"Relació entre Total de Temps i Rondes - {email_filter}")

    for idx, row in df.iterrows():
        if row['wasModificatedMatch']:
            plt.text(
                row['totalTime'], row['rounds'], "*", color="black", fontsize=12, ha="center", va="center"
            )

    if df['wasModificatedMatch'].any():
        plt.text(0, -0.1, "* = Partida Modificada", transform=plt.gca().transAxes,
            fontsize=10, color="black", ha="left", va="bottom")   

    email_filter_safe = email_filter.replace("@", "_").replace(".", "_")
    user_output_dir = os.path.join(output_dir, email_filter_safe)
    output_path2 = os.path.join(user_output_dir, "grafica_total_time_vs_rounds.png")
    plt.savefig(output_path2, dpi=300, bbox_inches='tight')