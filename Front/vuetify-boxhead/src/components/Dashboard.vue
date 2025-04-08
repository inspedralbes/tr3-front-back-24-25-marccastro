<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item title="Tauler de control Boxhead"></v-list-item>
        <v-list-item 
          v-for="(item, index) in menuItems" 
          :key="index" 
          @click="selectedComponent = item.component"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <div class="pa-2">
        <v-btn block href="http://localhost:8080/?server=mysql" target="_blank">Adminer</v-btn>
        <br>
        <v-btn block href="http://localhost:9000/#!/auth" target="_blank">Microserveis</v-btn>
        <br>
        <v-btn block color="success" prepend-icon="mdi-download" href="http://boxheadcontrol.dam.inspedralbes.cat:3002/uploads/game/boxhead-game.zip">
          Descargar Videojoc
        </v-btn>
        <br>
        <v-btn block color="red" @click="logout">Tanca sessió</v-btn>
      </div>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <component :is="selectedComponent" />
      </v-container>
    </v-main>
  </v-app>
</template>
  
<script setup>
import { ref } from 'vue'; // Importa 'ref' para crear variables reactivas en Vue
import BoxheadControl from './Boxhead-Control.vue'; // Importa el componente 'BoxheadControl'
import Users from './Users.vue'; // Importa el componente 'Users'
import Skins from './Skins.vue'; // Importa el componente 'Skins'
import Statistics from './Statistics.vue'; // Importa el componente 'Statistics'
import PurchaseHistory from './PurchaseHistory.vue'; // Importa el componente 'PurchaseHistory'
import { useRouter } from 'vue-router'; // Importa el 'useRouter' de Vue Router para navegar entre rutas

const router = useRouter(); // Crea una instancia del enrutador de Vue Router
const selectedComponent = ref(BoxheadControl); // Inicializa la variable reactiva 'selectedComponent' con el componente por defecto (BoxheadControl)
const menuItems = ref([ // Define una lista de objetos que representan las opciones de menú
  { icon: 'mdi-gamepad-variant', title: 'Boxhead Control', component: BoxheadControl }, // Opción para seleccionar 'Boxhead Control'
  { icon: 'mdi-package-variant-closed', title: 'Skins', component: Skins }, // Opción para seleccionar 'Skins'
  { icon: 'mdi-account-group', title: 'Usuaris', component: Users }, // Opción para seleccionar 'Usuaris'
  { icon: 'mdi-cash-register', title: 'Historial de Compres', component: PurchaseHistory }, // Opción para seleccionar 'Historial de Compres'
  { icon: 'mdi-chart-line', title: 'Estadistiques', component: Statistics} // Opción para seleccionar 'Estadistiques'
]);

// Función que se llama cuando el usuario hace logout
const logout = () => {
  localStorage.removeItem('token'); // Elimina el 'token' de localStorage, desconectando al usuario
  router.push('/'); // Redirige al usuario a la página de inicio (generalmente la página de login)
};
</script>