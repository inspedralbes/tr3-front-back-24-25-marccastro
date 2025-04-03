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
        <v-btn block color="success" prepend-icon="mdi-download" @click="downloadGame">
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
import { ref } from 'vue';
import BoxheadControl from './Boxhead-Control.vue';
import Users from './Users.vue';
import Skins from './Skins.vue';
import Statistics from './Statistics.vue';
import PurchaseHistory from './PurchaseHistory.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedComponent = ref(BoxheadControl);
const menuItems = ref([
  { icon: 'mdi-gamepad-variant', title: 'Boxhead Control', component: BoxheadControl },
  { icon: 'mdi-package-variant-closed', title: 'Skins', component: Skins },
  { icon: 'mdi-account-group', title: 'Usuaris', component: Users },
  { icon: 'mdi-cash-register', title: 'Historial de Compres', component: PurchaseHistory },
  { icon: 'mdi-chart-line', title: 'Estadistiques', component: Statistics}
]);

const logout = () => {
  localStorage.removeItem('token');
  router.push('/');
};

const downloadGame = async () => {
  try {
    const response = await fetch(`http://localhost:3002/download/game`);
    if (!response.ok) alert('Error a la descàrrega');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'boxhead-game.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error en descarregar:', error);
    alert("No s'ha pogut descarregar el joc");
  }
};
</script>