<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>Estadístiques de l'Usuari</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-alert v-if="loading" type="info" dismissible>
          Cargan imatges...
        </v-alert>

        <v-row>
          <v-col cols="12" md="4">
            <v-text-field 
              v-model="email" 
              label="Introdueix el correu electrònic" 
              outlined
              @keyup.enter="fetchStatistics"
            ></v-text-field>
            <v-btn @click="fetchStatistics">Cerca</v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="(image, index) in images" :key="index" cols="12" md="4">
            <v-card @click="openImage(image)">
              <v-img :src="`http://localhost:3002${image}`"></v-img>
            </v-card>
          </v-col>
        </v-row>
        
        <v-dialog v-model="imageDialog">
          <v-card>
            <v-img :src="selectedImage" height="500px"></v-img>
            <v-card-actions>
              <v-btn color="red" text @click="imageDialog = false">Tancar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'; // Importa 'ref' para crear variables reactivas en Vue

// Variables reactivas para gestionar el estado de la aplicación
const email = ref(''); // Almacena el correo electrónico que el usuario introduce
const images = ref([]); // Almacena las imágenes obtenidas del servidor
const loading = ref(false); // Indica si los datos están siendo cargados
const imageDialog = ref(false); // Controla si el modal de imagen está abierto
const selectedImage = ref(''); // Almacena la imagen seleccionada para su visualización

// Función para obtener las estadísticas e imágenes asociadas al correo electrónico del usuario
const fetchStatistics = async () => {
  // Verifica que se haya ingresado un correo electrónico
  if (!email.value) {
    alert('Si us plau, introduïu un correu electrònic.'); // Muestra un mensaje de error si no se ha ingresado un correo
    return;
  }

  loading.value = true; // Establece 'loading' a true para mostrar el estado de carga

  try {
    // Realiza una solicitud POST al servidor para obtener las estadísticas e imágenes del usuario
    const response = await fetch('http://localhost:3002/api/stats/get-stats', {
      method: 'POST', // Utiliza el método POST
      headers: {
        'Content-Type': 'application/json', // Especifica que el cuerpo de la solicitud es JSON
      },
      body: JSON.stringify({ email: email.value }), // Envía el correo electrónico como parámetro
    });

    const data = await response.json(); // Convierte la respuesta a formato JSON

    if (response.ok) {
      images.value = data.images || []; // Si la respuesta es exitosa, asigna las imágenes a la variable reactiva 'images'
    } else {
      alert(data.message || "No s'han trobat imatges per aquest usuari"); // Muestra un mensaje de error si no se encuentran imágenes
      images.value = []; // Si no se encuentran imágenes, asigna un arreglo vacío
    }
  } catch (error) {
    alert('Hi va haver un error en obtenir les imatges'); // Muestra un mensaje de error si ocurre un problema con la solicitud
  } finally {
    loading.value = false; // Establece 'loading' a false una vez que la solicitud se haya completado
  }
};

// Función para abrir el modal de imagen seleccionada
const openImage = (image) => {
  // Asigna la URL completa de la imagen seleccionada
  selectedImage.value = `http://localhost:3002${image}`;
  imageDialog.value = true; // Muestra el modal para ver la imagen
};
</script>