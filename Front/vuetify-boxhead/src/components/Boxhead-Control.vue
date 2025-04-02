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
                  thumb-label
                ></v-slider>
                <v-slider
                  v-model="speed"
                  label="Velocitat"
                  :min="1"
                  :max="10"
                  step="0.1"
                  thumb-label
                ></v-slider>
                <v-slider
                  v-if="selectedCharacter != 'Jugador'"
                  v-model="damage"
                  label="Dany"
                  :min="10"
                  :max="100"
                  step="5"
                  thumb-label
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
import { ref } from 'vue';
import { functionUpdateEnemy, functionUpdatePlayer, functionSocketRestart } from '../services/socketManager';

const health = ref(50);
const speed = ref(5);
const damage = ref(20);
const selectedCharacter = ref(null);
const characters = ref(['Jugador', 'Zombi', 'Zombie Gordo']);
const save = ref(false);

const colorName = ref('');
const colorNames = ref(['Blanc', 'Vermell', 'Blau', 'Verd']);

const getCharacter = (character) => {
  switch (character) {
    case 'Jugador':
      return 'Player'
    case 'Zombi':
      return 'Zombie';
    case 'Zombi Gordo':
      return 'FatZombie';
    default:
      return 'Player';
  }
}

const getColorHex = (color) => {
  switch (color) {
    case 'Blanc':
      return 'FFFFFF'
    case 'Vermell':
      return 'FF0000';
    case 'Blau':
      return '0000FF';
    case 'Verd':
      return '008000';
    default:
      return 'FFFFFF';
  }
};

const functionEnemy = () => {
  if (selectedCharacter.value && colorName.value) {
    const colorHex = getColorHex(colorName.value);
    const nameCharacter = getCharacter(selectedCharacter.value);
    save.value = false;

    functionUpdateEnemy(save, nameCharacter, health, speed, damage, colorHex);
  } else {
    alert("Seleccioneu un personatge i un color.");
  }
};

const functionPlayer = () => {
  const nameCharacter = getCharacter(selectedCharacter.value);
  functionUpdatePlayer(nameCharacter, health, speed);
}

const saveConfiguration = () => {
  if (selectedCharacter.value && colorName.value) {
    const colorHex = getColorHex(colorName.value);
    const nameCharacter = getCharacter(selectedCharacter.value);
    save.value = true;
    
    functionUpdateEnemy(save, nameCharacter, health, speed, damage, colorHex);
  } else {
    console.error("Por favor selecciona un personaje y un color.");
  }
};

const restartCharacter = () => {
  functionSocketRestart(selectedCharacter);
}
</script>
