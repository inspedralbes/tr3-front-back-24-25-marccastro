<template>
  <v-container>
    <v-alert v-if="loading" type="info" dismissible>
      Cargando usuarios...
    </v-alert>

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
        <v-btn @click="editUser(item)" color="yellow" small>Edit</v-btn>
        <v-btn @click="deleteUser(item)" color="red" small>Delete</v-btn>
      </template>
    </v-data-table>

    <v-alert v-if="!loading && users.length === 0" type="warning">
      No hay usuarios registrados.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const headers = [
  { text: 'Nombre', align: 'start', key: 'username', sortable: true },
  { text: 'Correo', align: 'start', key: 'email', sortable: true },
  { text: 'Admin', align: 'start', key: 'admin', sortable: true },
  { text: 'Acciones', align: 'center', key: 'actions', sortable: false }
];

const users = ref([]);
const loading = ref(true);

const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/users');
    const data = await response.json();
    users.value = data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const editUser = (user) => {
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
      alert('Usuario eliminado con éxito');
      fetchUsers();
    } else {
      alert(data.message || 'Hubo un error al eliminar el usuario');
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
  }
};
</script>
