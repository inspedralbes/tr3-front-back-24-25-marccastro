import os
import pymongo
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from dotenv import load_dotenv

# Cargar variables de entorno
dotenv_path = os.path.abspath(".env")
load_dotenv(dotenv_path)

# Conectar a MongoDB
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB", "Boxhead")
MONGODB_COLLECTION = os.getenv("MONGODB_COLLECTION", "statistics")

client = pymongo.MongoClient(MONGODB_URI)
db = client[MONGODB_DB]
collection = db[MONGODB_COLLECTION]

# Obtener todos los emails únicos en la base de datos
emails_unicos = collection.distinct("email")

# Directorio base para guardar las imágenes
output_dir = "images"
os.makedirs(output_dir, exist_ok=True)

for email_filter in emails_unicos:
    # Obtener datos desde MongoDB para el usuario actual
    data = list(collection.find(
        {"email": email_filter},
        {"kills": 1, "rounds": 1, "createdAt": 1, "totalTime": 1, "wasModificatedMatch": 1, "_id": 0}
    ))

    if not data:
        print(f"No se encontraron datos para el email: {email_filter}")
        continue

    # Convertir a DataFrame y formatear fecha
    df = pd.DataFrame(data)
    df['createdAt'] = pd.to_datetime(df['createdAt'], format='%Y-%m-%d')

    # Ordenar por fecha
    df = df.sort_values(by='createdAt')

    # Crear categorías
    df['Total Kills'] = df['kills']
    
    # Si hay más de una fecha, calcular diferencias
    if df['createdAt'].nunique() > 1:
        df['kills_prev'] = df['kills'].shift(1).fillna(0)
        df['Nuevas'] = np.where(df['kills'] > df['kills_prev'], df['kills_prev'], 0)
        df['Perdidas'] = np.where(df['kills'] < df['kills_prev'], df['kills_prev'], 0)
    else:
        df['Nuevas'] = 0
        df['Perdidas'] = 0

    # Agrupar datos
    df_grouped = df.groupby('createdAt').agg({
        'Nuevas': 'sum',
        'Perdidas': 'sum',
        'Total Kills': 'sum',
        'wasModificatedMatch': 'max'
    }).reset_index()

    # Convertir fecha a string y etiquetar partidas modificadas
    df_grouped['createdAt'] = df_grouped['createdAt'].dt.strftime('%Y-%m-%d')
    df_grouped['FechaEtiquetada'] = df_grouped.apply(
        lambda row: row['createdAt'] + (' *' if row['wasModificatedMatch'] else ''), axis=1
    )

    # Crear la figura para Kills
    plt.figure(figsize=(12, 6))
    sns.barplot(x="FechaEtiquetada", y="Total Kills", data=df_grouped, color='skyblue', label="Total Kills")
    sns.barplot(x="FechaEtiquetada", y="Nuevas", data=df_grouped, color='lightgreen', label="Nuevas")
    sns.barplot(x="FechaEtiquetada", y="Perdidas", data=df_grouped, color='salmon', label="Perdidas")

    plt.xlabel("Fecha")
    plt.ylabel("Kills")
    plt.title(f'Estadísticas de Kills por Fecha - {email_filter}')
    plt.xticks(rotation=45, ha="right")

    if df_grouped['wasModificatedMatch'].any():
        plt.text(0, -0.1, "* = Partida Modificada", transform=plt.gca().transAxes,
                 fontsize=10, color="black", ha="left", va="bottom")

    # Guardar imagen
    email_filter_safe = email_filter.replace("@", "_").replace(".", "_")
    user_output_dir = os.path.join(output_dir, email_filter_safe)
    os.makedirs(user_output_dir, exist_ok=True)

    output_path = os.path.join(user_output_dir, "grafica_kills.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')

    ### --- SEGUNDA GRÁFICA: ANSCOMBE’S QUARTET --- ###
    sns.set_theme(style="ticks")

    # Convertir la fecha en valores numéricos
    df['createdAt_num'] = df['createdAt'].apply(lambda x: pd.Timestamp(x).toordinal())

    # Graficar regresión
    g = sns.lmplot(
        data=df, x="createdAt_num", y="rounds", aspect=1.5, order=1, ci=None,
        scatter_kws={"s": 50, "color": "red"}, line_kws={"lw": 2, "color": "blue"}
    )

    g.set_axis_labels("Fecha", "Rounds")
    g.fig.suptitle(f"Rounds por Fecha - {email_filter}")

    # Redondear los valores de 'rounds' en el eje Y a enteros
    plt.gca().yaxis.get_major_locator().set_params(integer=True)

    # Cambiar los valores numéricos en el eje X por fechas reales
    tick_labels = df['createdAt'].dt.strftime('%Y-%m-%d').unique()
    g.set(xticks=df['createdAt_num'].unique(), xticklabels=tick_labels)
    plt.xticks(rotation=45, ha="right")

    # Agregar asteriscos en partidas modificadas
    for idx, row in df.iterrows():
        if row['wasModificatedMatch']:
            x_pos = row['createdAt_num']
            plt.text(x_pos, row['rounds'] - 0.5, "*", color="black", fontsize=12, ha="center", va="top")

    if df['wasModificatedMatch'].any():
        plt.text(0, -0.1, "* = Partida Modificada", transform=plt.gca().transAxes,
                 fontsize=10, color="black", ha="left", va="bottom")

    # Guardar la imagen
    output_path_anscombe = os.path.join(user_output_dir, "grafica_rounds.png")
    plt.savefig(output_path_anscombe, dpi=300, bbox_inches='tight')

        ### --- TERCERA GRÁFICA --- ###
    plt.figure(figsize=(12, 6))

    df['totalTime'] = df['totalTime'] / 60

    # Crear el gráfico de dispersión
    sns.scatterplot(x="totalTime", y="kills", data=df, color='blue', s=100, alpha=0.6, edgecolor='black')

    # Etiquetas y título
    plt.xlabel("Tiempo Total Jugado (minutos)")
    plt.ylabel("Kills")
    plt.title(f"Relación entre Total Time y Kills - {email_filter}")

    for idx, row in df.iterrows():
        if row['wasModificatedMatch']:
            plt.text(
                row['totalTime'], row['kills'], "*", color="black", fontsize=12, ha="center", va="center"
            )

    if df['wasModificatedMatch'].any():
        plt.text(0, -0.1, "* = Partida Modificada", transform=plt.gca().transAxes,
            fontsize=10, color="black", ha="left", va="bottom")   

    email_filter_safe = email_filter.replace("@", "_").replace(".", "_")
    user_output_dir = os.path.join(output_dir, email_filter_safe)
    output_path2 = os.path.join(user_output_dir, "grafica_total_time_vs_kills.png")
    plt.savefig(output_path2, dpi=300, bbox_inches='tight')

    print(f"Gráfica guardada para {email_filter}: {output_path_anscombe} : {output_path} : {output_path2}")
