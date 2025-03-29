<template>
  <v-container>
    <!-- Mostrar mensaje mientras se cargan los datos -->
    <v-alert v-if="loading" type="info" dismissible>
      Cargando usuarios...
    </v-alert>

    <!-- Tabla de usuarios -->
    <v-data-table
      v-if="!loading && users.length"
      :headers="headers"
      :items="users"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Usuarios Registrados</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <!-- Acciones para cada usuario -->
        <v-btn @click="editUser(item)" color="yellow" small>Edit</v-btn>
        <v-btn @click="deleteUser(item)" color="red" small>Delete</v-btn>
      </template>
    </v-data-table>

    <!-- Mostrar mensaje si no hay usuarios -->
    <v-alert v-if="!loading && users.length === 0" type="warning">
      No hay usuarios registrados.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Definir la estructura de los encabezados de la tabla
const headers = [
  { text: 'Nombre', align: 'start', key: 'username', sortable: true },
  { text: 'Correo', align: 'start', key: 'email', sortable: true },
  { text: 'Admin', align: 'start', key: 'admin', sortable: true },
  { text: 'Acciones', align: 'center', key: 'actions', sortable: false }
];

// Variables reactivas
const users = ref([]);
const loading = ref(true);

// Obtener los usuarios desde la API al cargar el componente
const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/users'); // URL de la API de usuarios
    const data = await response.json();
    users.value = data; // Asigna los datos recibidos a la variable users
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  } finally {
    loading.value = false; // Terminar la carga
  }
};

// Llamar a la función para cargar los usuarios cuando el componente se monte
onMounted(() => {
  fetchUsers();
});

// Función para editar un usuario
const editUser = (user) => {
  // Lógica para editar el usuario
  console.log('Editar usuario:', user);
};

const deleteUser = async (user) => {
  console.log('Eliminar usuario:', user);
  try {
    const response = await fetch('http://localhost:3002/api/users/delete-user', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    const data = await response.json();

    if (response.ok) {
      console.log(data.message); // Usuario eliminado
      alert('Usuario eliminado con éxito');
      fetchUsers();
    } else {
      console.error('Error al eliminar el usuario:', data.message);
      alert(data.message || 'Hubo un error al eliminar el usuario');
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
  }
};
</script>

<style scoped>
/* Estilos para el componente Users */
</style>
