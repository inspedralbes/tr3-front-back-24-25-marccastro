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
              <v-img :src="`http://boxheadcontrol.dam.inspedralbes.cat:3002${image}`"></v-img>
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
import { ref } from 'vue';

const email = ref('');
const images = ref([]);
const loading = ref(false);
const imageDialog = ref(false);
const selectedImage = ref('');

const fetchStatistics = async () => {
  if (!email.value) {
    alert('Si us plau, introduïu un correu electrònic.');
    return;
  }

  loading.value = true;

  try {
    const response = await fetch('http://boxheadcontrol.dam.inspedralbes.cat:3002/api/stats/get-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    });

    const data = await response.json();

    if (response.ok) {
      images.value = data.images || [];
    } else {
      alert(data.message || "No s'han trobat imatges per aquest usuari");
      images.value = [];
    }
  } catch (error) {
    alert('Hi va haver un error en obtenir les imatges');
  } finally {
    loading.value = false;
  }
};

const openImage = (image) => {
  selectedImage.value = `http://boxheadcontrol.dam.inspedralbes.cat:3002${image}`;
  imageDialog.value = true;
};
</script>