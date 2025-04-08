<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Historial de Compres</v-toolbar-title>
    </v-toolbar>
  
    <v-alert v-if="loading" type="info" dismissible>
      Cargan historial de compres...
    </v-alert>
  
    <v-alert v-else-if="purchases.length === 0" type="warning">
      No hi ha compres registrades.
    </v-alert>
  
    <v-data-table v-else :headers="headers" :items="purchases" item-key="id" class="elevation-1">
      <template v-slot:item.image="{ item }">
        <v-img :src="`http://localhost:3002${item.Skin?.imagePath}`" height="50"></v-img>
      </template>
      <template v-slot:item.skin="{ item }">
        {{ item.Skin?.name || 'Sense nom' }}
      </template>
      <template v-slot:item.user="{ item }">
        {{ item.User?.email || 'Desconegut' }}
      </template>
      <template v-slot:item.price="{ item }">
        <strong>{{ item.price }}€</strong>
      </template>
      <template v-slot:item.date="{ item }">
        {{ new Date(item.purchase_date).toLocaleDateString() }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Importa 'ref' para crear variables reactivas y 'onMounted' para ejecutar código cuando el componente se monta

// Definir variables reactivas
const purchases = ref([]); // 'purchases' es una variable reactiva que guarda el historial de compras
const loading = ref(true); // 'loading' es una variable reactiva que indica si los datos aún se están cargando
const error = ref(null); // 'error' es una variable reactiva que guarda cualquier error que ocurra al obtener los datos

// Definir las cabeceras para la tabla que mostrará los datos de las compras
const headers = [
  { text: "Imagen", value: "image" }, // Columna para la imagen del 'skin'
  { text: "Skin", value: "skin" }, // Columna para el nombre del 'skin'
  { text: "Usuario", value: "user" }, // Columna para el nombre del 'usuario'
  { text: "Precio", value: "price" }, // Columna para el precio de la compra
  { text: "Fecha", value: "date" } // Columna para la fecha de la compra
];

// Función asincrónica que obtiene el historial de compras desde el servidor
const fetchPurchases = async () => {
  try {
    // Realiza una solicitud GET al servidor para obtener el historial de compras
    const response = await fetch(`http://localhost:3002/api/purchases`);

    // Si la solicitud es exitosa, se convierte la respuesta en formato JSON y se guarda en 'purchases'
    const data = await response.json();
    purchases.value = data;
  } catch (err) {
    // Si hay un error al hacer la solicitud, se registra en la consola
    console.error("Error en obtenir l'historial de compres:", err);
    error.value = 'Error al obtener el historial de compras'; // Se guarda un mensaje de error
  } finally {
    // Cuando se termina la solicitud, ya sea con éxito o error, se cambia el valor de 'loading' a false
    loading.value = false;
  }
};

// Se llama a la función 'fetchPurchases' cuando el componente se monta (es decir, cuando se carga en la vista)
onMounted(() => {
  fetchPurchases();
});
</script>