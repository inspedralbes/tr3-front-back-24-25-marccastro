<template>
    <v-app>
      <!-- Header -->
      <v-app-bar app>
        <v-toolbar-title>Boxhead Control</v-toolbar-title>
      </v-app-bar>
  
      <!-- Main Content -->
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
                  <!-- Slider para Velocidad -->
                  <v-slider v-model="velocity" label="Velocidad" :min="1" :max="10" step="1"></v-slider>
                  <v-slider v-model="damage" label="Daño" :min="1" :max="100" step="1"></v-slider>
  
                  <!-- Selector de Sprite -->
                  <v-select
                    v-model="sprite"
                    :items="sprites"
                    label="Sprite"
                  ></v-select>
                </v-card-text>
  
                <v-card-actions>
                  <v-btn @click="updateCharacter">Actualizar Personaje</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
  
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title>
                  <span class="headline">Conexión a Sockets</span>
                </v-card-title>
                <v-card-text>
                  <v-btn @click="connectToSocket">Conectar</v-btn>
                  <p v-if="connected">Conectado a Socket</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
</template>
  
<script setup>
  import { ref } from 'vue'
  // import io from 'socket.io-client'
  
  // Estados reactivos
  const velocity = ref(5)
  const damage = ref(50)
  const sprite = ref(null)
  const sprites = ref(['Sprite1', 'Sprite2', 'Sprite3'])
  const connected = ref(false)
  
  let socket = null
  
  // Conectar al servidor de sockets
  const connectToSocket = () => {
    socket = io('http://localhost:3000') // Dirección de tu servidor socket
    socket.on('connect', () => {
      connected.value = true
      console.log('Conectado a socket')
    })
  
    socket.on('disconnect', () => {
      connected.value = false
      console.log('Desconectado de socket')
    })
  }
  
  // Actualizar los atributos del personaje
  const updateCharacter = () => {
    if (socket) {
      socket.emit('updateCharacter', {
        velocity: velocity.value,
        damage: damage.value,
        sprite: sprite.value,
      })
      console.log('Atributos actualizados:', {
        velocity: velocity.value,
        damage: damage.value,
        sprite: sprite.value,
      })
    }
  }
</script>
  
<style scoped>
  .v-btn {
    margin-top: 10px;
  }
</style>