import os
from pymongo import MongoClient
from dotenv import load_dotenv
import seaborn as sns
import matplotlib.pyplot as plt
from datetime import datetime

# Cargar variables de entorno
load_dotenv()

def connect_to_mongodb():
    """Establece conexión con MongoDB"""
    try:
        client = MongoClient(os.getenv("MONGODB_URI"))
        db = client[os.getenv("MONGODB_DB")]
        collection = db[os.getenv("MONGODB_COLLECTION")]
        return collection
    except Exception as e:
        print(f"Error conectando a MongoDB: {e}")
        return None

def get_player_stats(email, collection):
    """Obtiene estadísticas del jugador"""
    query = {"email": email}
    projection = {"kills": 1, "createdAt": 1, "_id": 0}
    return list(collection.find(query, projection))

def generate_kills_plot(email, output_filename):
    """Genera y guarda el gráfico de kills por fecha"""
    current_dir = os.getcwd()
    graph_dir = os.path.join(current_dir, 'Images')
    # Conectar a MongoDB
    collection = connect_to_mongodb()
    if not collection:
        return False
    
    # Obtener datos
    stats = get_player_stats(email, collection)
    if not stats:
        print(f"No se encontraron estadísticas para {email}")
        return False
    
    # Procesar datos
    data = []
    for stat in stats:
        try:
            date = datetime.strptime(stat["createdAt"], "%Y-%m-%d").date()
            data.append({
                "Fecha": date,
                "Kills": stat["kills"],
                "Día": date.strftime("%d/%m/%Y")
            })
        except Exception as e:
            print(f"Error procesando dato: {e}")
    
    if not data:
        print("No hay datos válidos para graficar")
        return False
    
    # Configurar gráfico
    plt.figure(figsize=(12, 6))
    sns.set_style("whitegrid")
    
    # Crear gráfico de barras acumuladas
    ax = sns.barplot(
        data=data,
        x="Día",
        y="Kills",
        hue="Día",
        palette="viridis",
        estimator=sum,
        ci=None,
        dodge=False
    )
    
    # Personalizar gráfico
    plt.title(f"Estadísticas de Kills - {email}", fontsize=14, pad=20)
    plt.xlabel("Fecha", fontsize=12)
    plt.ylabel("Total de Kills", fontsize=12)
    plt.xticks(rotation=45, ha='right')
    
    # Eliminar leyenda si hay muchas fechas
    if len(data) > 7:
        ax.legend().remove()
    
    # Ajustar layout y guardar
    graph_path = os.path.join(graph_dir, output_filename)
    plt.tight_layout()
    plt.savefig(output_filename, dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"Gráfico guardado como {output_filename}")
    return True

# Ejemplo de uso
if __name__ == "__main__":
    email_usuario = "marc@gmail.com"  # Cambiar por el email deseado
    generate_kills_plot(email_usuario, "kills_evolution.png")