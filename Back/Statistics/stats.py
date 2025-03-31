import os
import pymongo
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Conexión con MongoDB usando pymongo y manejo de excepciones
try:
    # Obtener los valores de las variables de entorno
    MONGODB_URI = os.getenv("MONGODB_URI")
    MONGODB_DB = os.getenv("MONGODB_DB")
    MONGODB_COLLECTION = os.getenv("MONGODB_COLLECTION")

    # Conectar al cliente de MongoDB
    client = pymongo.MongoClient(MONGODB_URI)
    
    # Seleccionar la base de datos y colección de MongoDB
    db = client[MONGODB_DB]
    collection = db[MONGODB_COLLECTION]
except pymongo.errors.ConnectionError as e:
    # Manejar los posibles errores de conexión
    print(f"Error de conexión con MongoDB: {e}")
    exit(1)  # Si hay error, salir del programa

# Obtener datos de MongoDB con los campos 'kills', 'createdAt' y 'email'
data = list(collection.find({}, {"_id": 0, "kills": 1, "createdAt": 1, "email": 1}))

# Convertir los datos obtenidos en un DataFrame de pandas
df = pd.DataFrame(data)

# Asegurarnos de que la columna 'createdAt' sea tipo fecha para trabajar con ella
df["createdAt"] = pd.to_datetime(df["createdAt"])

# Verificar si hay valores nulos en la columna 'email' y eliminarlos
df = df.dropna(subset=["email"])

# Asegurarnos de que la columna 'email' sea tipo string
df["email"] = df["email"].astype(str)

# Crear los "bins" en escala logarítmica para el histograma basado en el valor máximo de 'kills'
bins = np.logspace(0, np.log10(df["kills"].max()), 20)  # Ajustar según el máximo de kills

# Graficar el histograma apilado, diferenciando por 'email'
plt.figure(figsize=(12, 6))
sns.histplot(data=df, x="kills", hue="email", bins=bins, multiple="stack", log_scale=True)

# Mejoras visuales para el gráfico
plt.xlabel("Kills (Escala Log)")  # Etiqueta del eje X
plt.ylabel("Frecuencia")  # Etiqueta del eje Y
plt.title("Histograma Apilado de Kills por Email (Escala Log)")  # Título del gráfico

# Ajuste manual de la leyenda
handles, labels = plt.gca().get_legend_handles_labels()  # Obtener los handles y labels de la leyenda
plt.legend(handles=handles, labels=labels, title="Email", loc="upper right", bbox_to_anchor=(1.3, 1))

# Mejorar la distribución del gráfico para evitar superposiciones
plt.tight_layout()

# Mostrar el gráfico
plt.show()