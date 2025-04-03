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
import { ref, onMounted } from 'vue';

const purchases = ref([]);
const loading = ref(true);
const error = ref(null);

const headers = [
  { text: "Imagen", value: "image" },
  { text: "Skin", value: "skin" },
  { text: "Usuario", value: "user" },
  { text: "Precio", value: "price" },
  { text: "Fecha", value: "date" }
];

const fetchPurchases = async () => {
  try {
    const response = await fetch(`http://localhost:3002/api/purchases`);

    const data = await response.json();
    purchases.value = data;
  } catch (err) {
    console.error("Error en obtenir l'historial de compres:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPurchases();
});
</script>