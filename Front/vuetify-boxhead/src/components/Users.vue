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
import { ref, onMounted } from 'vue'; // Importa 'ref' y 'onMounted' de Vue para trabajar con variables reactivas y ciclo de vida del componente

// Definición de las cabeceras de la tabla
const headers = [
  { text: 'Nombre', key: 'username', sortable: true }, // Columna para el nombre de usuario
  { text: 'Email', key: 'email', sortable: true }, // Columna para el email del usuario
  { text: 'Acciones', key: 'actions', sortable: false } // Columna para las acciones, como editar o eliminar
];

// Variables reactivas para gestionar el estado de la lista de usuarios y el estado de la carga
const users = ref([]); // Almacena los usuarios obtenidos desde el servidor
const loading = ref(true); // Indica si los datos están siendo cargados
const editDialog = ref(false); // Controla la visibilidad del diálogo de edición
const editedUser = ref({ id: null, username: '', email: '', password: '' }); // Almacena los datos del usuario que se está editando

// Función para obtener los usuarios del servidor
const fetchUsers = async () => {
  try {
    // Realiza una solicitud GET al servidor para obtener la lista de usuarios
    const response = await fetch('http://localhost:3002/api/users');

    const data = await response.json(); // Convierte la respuesta en formato JSON
    users.value = data; // Asigna los usuarios obtenidos a la variable reactiva 'users'
  } catch (error) {
    console.error("Error en obtener los usuarios:", error); // Maneja errores si la solicitud falla
  } finally {
    loading.value = false; // Cambia el estado de 'loading' a false una vez completada la solicitud
  }
};

// Hook de ciclo de vida 'onMounted' que se ejecuta cuando el componente se monta
onMounted(() => {
  fetchUsers(); // Llama a la función 'fetchUsers' para obtener los usuarios cuando el componente se monta
});

// Función para abrir el diálogo de edición de un usuario
const openEditDialog = (user) => {
  // Asigna los datos del usuario a la variable 'editedUser' para que puedan ser editados
  editedUser.value = { id: user.id, username: user.username, email: user.email, password: '' };
  editDialog.value = true; // Muestra el diálogo de edición
};

// Función para guardar los cambios de un usuario editado
const saveUser = async () => {
  try {
    const userData = { ...editedUser.value }; // Crea una copia de los datos del usuario a editar

    // Realiza una solicitud PUT para actualizar los datos del usuario en el servidor
    const response = await fetch(`http://localhost:3002/api/users/edit-user`, {
      method: 'PUT', // Utiliza el método PUT para editar
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData) // Envía los datos del usuario a actualizar en formato JSON
    });

    const data = await response.json(); // Convierte la respuesta a formato JSON

    // Verifica si la respuesta fue exitosa
    if (!response.ok) alert(data.message || 'Hi va haver un error en editar la skin');
    alert('Usuari actualiztat amb èxito'); // Muestra un mensaje de éxito

    fetchUsers(); // Vuelve a obtener la lista de usuarios actualizada

    editDialog.value = false; // Cierra el diálogo de edición
  } catch (error) {
    console.error("Error al actualizar usuario:", error); // Maneja errores si la solicitud falla
    alert(error.message); // Muestra un mensaje de error
  }
};

// Función para eliminar un usuario
const deleteUser = async (user) => {
  // Solicita confirmación antes de eliminar al usuario
  if (!confirm(`¿Estás seguro de que quieres eliminar a ${user.username}?`)) return;

  try {
    // Realiza una solicitud DELETE para eliminar al usuario del servidor
    const response = await fetch(`http://localhost:3002/api/delete-user`, {
      method: 'DELETE', // Utiliza el método DELETE para eliminar
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }) // Envía el ID del usuario que se desea eliminar
    });

    const data = await response.json(); // Convierte la respuesta a formato JSON

    if (!response.ok) alert(data.message || "Error al eliminar l'usuari"); // Muestra mensaje de error si la eliminación falla

    alert('Usuari eliminat amb èxito'); // Muestra un mensaje de éxito si la eliminación fue exitosa
    fetchUsers(); // Vuelve a obtener la lista de usuarios actualizada
  } catch (error) {
    console.error("Error en eliminar l'usuari:", error); // Maneja errores si la solicitud falla
    alert(error.message); // Muestra un mensaje de error
  }
};
</script>