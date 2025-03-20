<template>
    <v-app>
      <!-- Barra de navegación lateral -->
      <v-navigation-drawer app permanent>
        <v-list>
            <v-list-item title="Dashboard Boxhead"></v-list-item>
            <!-- Iteramos sobre el array menuItems para crear los elementos del menú -->
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
            <v-btn block @click="logout"> Logout </v-btn>
        </div>
      </v-navigation-drawer>
  
      <!-- Área principal donde cambiaremos el contenido según el componente seleccionado -->
      <v-main>
        <v-container>
          <!-- Cargar el componente dinámicamente basado en la selección -->
          <component :is="selectedComponent" />
        </v-container>
      </v-main>
    </v-app>
  </template>
  
<script setup>
import { ref } from 'vue';
  
// Importamos los componentes secundarios
import BoxheadControl from './Boxhead-Control.vue';
import Users from './Users.vue';
import Products from './Products.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
// Variable reactiva para controlar el componente que se va a mostrar
const selectedComponent = ref(BoxheadControl); // Componente por defecto
  
// Menú de navegación con los íconos y componentes
const menuItems = ref([
    { icon: 'mdi-gamepad-variant', title: 'Boxhead Control', component: BoxheadControl },
    { icon: 'mdi-account-group', title: 'Users', component: Users },
    { icon: '', title: 'Products', component: Products }
]);

const logout = () => {
    router.push('/');
}
</script>