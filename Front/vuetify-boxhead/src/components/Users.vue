<template>
  <v-container>
    <v-alert v-if="loading" type="info" dismissible>
      Cargan usuaris...
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
          <v-toolbar-title>Usuaris Registrats</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn @click="editUser(item)" color="yellow" small>Edita</v-btn>
        <v-btn @click="deleteUser(item)" color="red" small>Eliminar</v-btn>
      </template>
    </v-data-table>

    <v-alert v-if="!loading && users.length === 0" type="warning">
      No hi ha usuaris registrats.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const headers = [
  { text: 'Nom', align: 'start', key: 'username', sortable: true },
  { text: 'Email', align: 'start', key: 'email', sortable: true },
  { text: 'Administrador', align: 'start', key: 'admin', sortable: true },
  { text: 'Accions', align: 'center', key: 'actions', sortable: false }
];

const users = ref([]);
const loading = ref(true);

const fetchUsers = async () => {
  try {
    const response = await fetch('http://boxheadcontrol.dam.inspedralbes.cat:3002/api/users');
    const data = await response.json();
    users.value = data;
  } catch (error) {
    console.error('Error en obtenir els usuaris:', error);
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
    const response = await fetch('http://boxheadcontrol.dam.inspedralbes.cat:3002/api/users/delete-user', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    const data = await response.json();

    if (response.ok) {
      alert('Usuari eliminat amb èxit');
      fetchUsers();
    } else {
      alert(data.message || "Hi va haver un error en eliminar l'usuari");
    }
  } catch (error) {
    console.error("Error en eliminar l'usuari:", error);
  }
};
</script>
