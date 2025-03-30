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
                  v-model="selectedCharacter"
                  :items="characters"
                  label="Seleccionar Personaje"
                  outlined
                ></v-select>
                <v-slider
                  v-model="health"
                  label="Health"
                  :min="1"
                  :max="100"
                  step="1"
                  thumb-label
                ></v-slider>
                <v-slider
                  v-model="speed"
                  label="Speed"
                  :min="1"
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
                <!-- Selector para los colores -->
                <v-select
                  v-model="colorName"
                  :items="colorNames"
                  label="Seleccionar Color"
                  outlined
                ></v-select>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="updateCharacter">Actualizar Personaje</v-btn>
                <v-btn @click="saveConfiguration">Guardar Configuración</v-btn>
                <v-btn @click="restartCharacter">Restaurar Personaje</v-btn>
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
import { functionSocket, functionSocketRestart } from '../services/socketManager';

// Atributos de control
const health = ref(50); // Valor predeterminado
const speed = ref(5); // Valor predeterminado
const damage = ref(20); // Valor predeterminado
const selectedCharacter = ref(null); // Nombre del personaje seleccionado
const characters = ref(['Player', 'Zombie', 'FatZombie']); // Personajes disponibles
const save = ref(false);

// Selector para el color (por nombre)
const colorName = ref(''); // Valor predeterminado
const colorNames = ref(['White', 'Rojo', 'Azul', 'Verde']); // Colores por nombre

// Función para convertir el nombre del color a su valor hexadecimal
const getColorHex = (color) => {
  switch (color) {
    case 'White':
      return 'FFFFFF'
    case 'Rojo':
      return 'FF0000';
    case 'Azul':
      return '0000FF';
    case 'Verde':
      return '008000';
    default:
      return 'FFFFFF'; // Blanco como color predeterminado
  }
};

const updateCharacter = () => {
  if (selectedCharacter.value && colorName.value) {
    // Convertir el color a hexadecimal
    const colorHex = getColorHex(colorName.value);
    save.value = false;  // Indicamos que es una actualización, no un guardado

    // Llamamos a la función para enviar los datos al servidor
    functionSocket(save, selectedCharacter, health, speed, damage, colorHex);
  } else {
    console.error("Por favor selecciona un personaje y un color.");
  }
};

const saveConfiguration = () => {
  if (selectedCharacter.value && colorName.value) {
    // Convertir el color a hexadecimal
    const colorHex = getColorHex(colorName.value);
    save.value = true;  // Indicamos que estamos guardando la configuración
    
    // Llamamos a la función para enviar los datos al servidor
    functionSocket(save, selectedCharacter, health, speed, damage, colorHex);
  } else {
    console.error("Por favor selecciona un personaje y un color.");
  }
};

const restartCharacter = () => {
  functionSocketRestart(selectedCharacter);
}
</script>
