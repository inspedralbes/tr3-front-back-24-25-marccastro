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
                 
                <v-select
                  v-model="selectedEnemy"
                  :items="enemies"
                  label="Seleccionar Enemigo"
                  outlined
                ></v-select>

                <v-slider
                  v-model="health"
                  label="Health"
                  :min="0"
                  :max="100"
                  step="1"
                  thumb-label
                ></v-slider>
                <v-slider
                  v-model="speed"
                  label="Speed"
                  :min="0"
                  :max="10"
                  step="0.1"
                  thumb-label
                ></v-slider>
                <v-slider
                  v-model="damage"
                  label="Damage"
                  :min="10"
                  :max="100"
                  step="5"
                  thumb-label
                ></v-slider>

                <v-select
                  v-model="sprite"
                  :items="sprites"
                  label="Sprite"
                  outlined
                ></v-select>
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

const health = ref(50); // Valor predeterminado
const speed = ref(5); // Valor predeterminado
const damage = ref(20); // Valor predeterminado
const sprite = ref(null);
const selectedEnemy = ref(null); // Nombre del enemigo seleccionado
const enemies = ref(['Zombie', 'DogZombie']); // Enemigos disponibles
const sprites = ref(['Sprite1', 'Sprite2', 'Sprite3']); // Sprites disponibles

const updateCharacter = () => {
  if (selectedEnemy.value) {
    // Llamamos a la función para enviar los datos al servidor
    functionSocket(health, speed, damage, sprite);
  } else {
    console.error("Por favor selecciona un enemigo.");
  }
};
</script>
