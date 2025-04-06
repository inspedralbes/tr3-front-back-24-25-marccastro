<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>Panell de característiques</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="pa-4" style="min-width: 700px;">
              <v-card-title>
                <span class="headline">Control de Personatges</span>
              </v-card-title>
              <v-card-subtitle>
                Ajusta els atributs dels personatges a temps real.
              </v-card-subtitle>
              <v-card-text>
                <v-select
                  v-model="selectedCharacter"
                  :items="characters"
                  label="Seleccionar Personatge"
                  outlined
                ></v-select>
                <v-slider
                  v-model="health"
                  label="Vida"
                  :min="1"
                  :max="100"
                  step="1"
                  thumb-label="always"
                ></v-slider>
                <v-slider
                  v-model="speed"
                  label="Velocitat"
                  :min="1"
                  :max="10"
                  step="0.1"
                  thumb-label="always"
                ></v-slider>
                <v-slider
                  v-if="selectedCharacter != 'Jugador'"
                  v-model="damage"
                  label="Dany"
                  :min="10"
                  :max="100"
                  step="5"
                  thumb-label="always"
                ></v-slider>
                <v-select
                  v-if="selectedCharacter != 'Jugador'"
                  v-model="colorName"
                  :items="colorNames"
                  label="Seleccionar Color"
                  outlined
                ></v-select>
              </v-card-text>
              <v-card-actions>
                <v-btn v-if="selectedCharacter == 'Jugador'" @click="functionPlayer">Actualitzar Configuració</v-btn>
                <v-btn v-if="selectedCharacter != 'Jugador'" @click="functionEnemy">Actualitzar Configuració</v-btn>
                <v-btn v-if="selectedCharacter != 'Jugador'" @click="saveConfiguration">Desa Configuració</v-btn>
                <v-btn v-if="selectedCharacter != 'Jugador'" @click="restartCharacter">Restaurar Configuració</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    
  </v-app>
</template>

<script setup>
import { ref } from 'vue'; // Importa 'ref' para crear referencias reactivas en Vue
import { functionUpdateEnemy, functionUpdatePlayer, functionSocketRestart } from '../services/socketManager'; // Importa funciones para manejar la actualización de estadísticas y reinicio de personajes a través de WebSocket

// Variables reactivas que mantienen el estado de las características del personaje
const health = ref(50); // Salud del personaje
const speed = ref(5); // Velocidad del personaje
const damage = ref(20); // Daño del personaje
const selectedCharacter = ref(null); // Personaje seleccionado
const characters = ref(['Jugador', 'Zombi', 'Zombie Gordo']); // Lista de personajes disponibles
const save = ref(false); // Indica si la configuración debe guardarse

// Variables para manejar el color del personaje
const colorName = ref(''); // Color seleccionado
const colorNames = ref(['Blanc', 'Vermell', 'Blau', 'Verd']); // Lista de colores disponibles

// Función para obtener el nombre adecuado del personaje basado en la selección
const getCharacter = (character) => {
  switch (character) {
    case 'Jugador': // Si es 'Jugador', retorna 'Player'
      return 'Player'
    case 'Zombi': // Si es 'Zombi', retorna 'Zombie'
      return 'Zombie';
    case 'Zombi Gordo': // Si es 'Zombi Gordo', retorna 'FatZombie'
      return 'FatZombie';
    default:
      return 'Player'; // Si no hay coincidencias, por defecto es 'Player'
  }
}

// Función que devuelve el código hexadecimal del color según la selección
const getColorHex = (color) => {
  switch (color) {
    case 'Blanc': // Si es 'Blanc', retorna 'FFFFFF' (blanco)
      return 'FFFFFF'
    case 'Vermell': // Si es 'Vermell', retorna 'FF0000' (rojo)
      return 'FF0000';
    case 'Blau': // Si es 'Blau', retorna '0000FF' (azul)
      return '0000FF';
    case 'Verd': // Si es 'Verd', retorna '008000' (verde)
      return '008000';
    default:
      return 'FFFFFF'; // Si no hay coincidencias, por defecto es blanco
  }
};

// Función que se llama cuando se quiere actualizar las estadísticas del enemigo
const functionEnemy = () => {
  // Verifica que haya un personaje seleccionado y un color seleccionado
  if (selectedCharacter.value && colorName.value) {
    const colorHex = getColorHex(colorName.value); // Obtiene el color hexadecimal
    const nameCharacter = getCharacter(selectedCharacter.value); // Obtiene el nombre adecuado del personaje
    save.value = false; // No se está guardando la configuración

    // Llama a la función que actualiza las estadísticas del enemigo
    functionUpdateEnemy(save, nameCharacter, health, speed, damage, colorHex);
  } else {
    alert("Seleccioneu un personatge i un color."); // Si falta un personaje o un color, muestra un mensaje
  }
};

// Función que se llama cuando se quiere actualizar las estadísticas del jugador
const functionPlayer = () => {
  // Obtiene el nombre del personaje seleccionado
  const nameCharacter = getCharacter(selectedCharacter.value);

  // Llama a la función que actualiza las estadísticas del jugador
  functionUpdatePlayer(nameCharacter, health, speed);
}

// Función que guarda la configuración de las estadísticas del personaje
const saveConfiguration = () => {
  // Verifica que haya un personaje y color seleccionados
  if (selectedCharacter.value && colorName.value) {
    const colorHex = getColorHex(colorName.value); // Obtiene el color hexadecimal
    const nameCharacter = getCharacter(selectedCharacter.value); // Obtiene el nombre adecuado del personaje
    save.value = true; // Marca que la configuración debe guardarse
    
    // Llama a la función que actualiza las estadísticas del enemigo
    functionUpdateEnemy(save, nameCharacter, health, speed, damage, colorHex);
  } else {
    console.error("Seleccioneu un personatge i un color."); // Si falta un personaje o color, muestra un error
  }
};

// Función que reinicia las estadísticas del personaje
const restartCharacter = () => {
  // Llama a la función que reinicia las estadísticas a través de WebSocket
  functionSocketRestart(selectedCharacter);
}
</script>