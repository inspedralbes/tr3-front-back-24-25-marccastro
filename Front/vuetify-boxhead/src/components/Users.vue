<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Usuarios Registrados</v-toolbar-title>
    </v-toolbar>

    <v-alert v-if="loading" type="info" dismissible>
      Cargando usuarios...
    </v-alert>

    <v-alert v-else-if="users.length === 0" type="warning">
      No hay usuarios registrados.
    </v-alert>

    <v-data-table v-else :headers="headers" :items="users" item-key="id" class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-btn @click="openEditDialog(item)" color="yellow" small>Edita</v-btn>
        <v-btn @click="deleteUser(item)" color="red" small>Eliminar</v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edita Usuari</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editedUser.username" label="Nom d'usuari" required></v-text-field>
          <v-text-field v-model="editedUser.email" label="Email" type="email" required></v-text-field>
          <v-text-field v-model="editedUser.password" label="Nova Contraseña" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="saveUser">Guardar</v-btn>
          <v-btn color="red" @click="editDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const headers = [
  { text: 'Nombre', key: 'username', sortable: true },
  { text: 'Email', key: 'email', sortable: true },
  { text: 'Acciones', key: 'actions', sortable: false }
];

const users = ref([]);
const loading = ref(true);
const editDialog = ref(false);
const editedUser = ref({ id: null, username: '', email: '', password: '' });

const fetchUsers = async () => {
  try {
    const response = await fetch('http://boxheadcontrol.dam.inspedralbes.cat:3002/api/users');

    const data = await response.json();
    users.value = data;
  } catch (error) {
    console.error("Error en obtener los usuarios:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const openEditDialog = (user) => {
  editedUser.value = { id: user.id, username: user.username, email: user.email, password: '' };
  editDialog.value = true;
};

const saveUser = async () => {
  try {
    const userData = { ...editedUser.value };

    const response = await fetch(`http://boxheadcontrol.dam.inspedralbes.cat:3002/api/users/edit-user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) alert(data.message || 'Hi va haver un error en editar la skin');
    alert('Usuari actualiztat amb èxito');

    fetchUsers();

    editDialog.value = false;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    alert(error.message);
  }
};

const deleteUser = async (user) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar a ${user.username}?`)) return;

  try {
    const response = await fetch(`http://boxheadcontrol.dam.inspedralbes.cat:3002/api/delete-user`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    });

    if (!response.ok) alert(data.message || "Error al eliminar l'usuari");

    const data = await response.json();

    alert('Usuari eliminat amb èxit');
    fetchUsers();
  } catch (error) {
    console.error("Error en eliminar l'usuari:", error);
    alert(error.message);
  }
};
</script>