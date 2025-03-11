<template>
    <v-app>
      <v-app-bar>
        <v-toolbar-title>Boxhead Control</v-toolbar-title>
      </v-app-bar>
  
      <v-main>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title>
                  <span class="headline">Control de Personajes</span>
                </v-card-title>
                <v-card-subtitle>
                  Ajusta los atributos de los personajes en tiempo real.
                </v-card-subtitle>
                <v-card-text>
                  <v-slider v-model="speed" label="Speed" :min="1" :max="10" step="1" thumb-label></v-slider>
                  <v-slider v-model="damage" label="Damage" :min="1" :max="10" step="1" thumb-label></v-slider>
  
                  <v-select v-model="sprite" :items="sprites" label="Sprite"></v-select>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="updateCharacter">Actualizar Personaje</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { functionSocket } from '../services/socketManager';
  
  const speed = ref(0);
  const damage = ref(0);
  const sprite = ref(null);
  const sprites = ref(['Sprite1', 'Sprite2', 'Sprite3']);
  
  const updateCharacter = () => {
    console.log(speed.value);
    functionSocket(speed, damage);
  }
  </script>