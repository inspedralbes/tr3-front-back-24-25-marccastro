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
        <v-btn block href="http://localhost:9000/#!/auth" target="_blank">Microserveis</v-btn>
        <br>
        <v-btn block @click="logout">Tanca sessió</v-btn>
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
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedComponent = ref(BoxheadControl);
const menuItems = ref([
  { icon: 'mdi-gamepad-variant', title: 'Boxhead Control', component: BoxheadControl },
  { icon: 'mdi-account-group', title: 'Usuaris', component: Users },
  { icon: 'mdi-package-variant-closed', title: 'Skins', component: Skins },
  { icon: 'mdi-chart-line', title: 'Estadistiques', component: Statistics}
]);

const logout = () => {
  localStorage.removeItem('token');
  router.push('/');
};
</script>