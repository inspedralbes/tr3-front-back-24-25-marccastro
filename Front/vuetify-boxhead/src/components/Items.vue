<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>Items</v-toolbar-title>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <v-alert v-if="loading" type="info" dismissible>
          Cargando items...
        </v-alert>
        <v-row>
          <!-- Botón para crear un nuevo item -->
          <v-col cols="12" md="4">
            <v-btn @click="openCreateModal" color="success" class="mt-4">Crear Producto</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- Listado de items -->
          <v-col v-for="item in items" v-if="!loading && items.length" :key="item.id" cols="12" md="4">
            <v-card>
              <v-img :src="`http://localhost:3002${item.imagePath}`" height="200px"></v-img>
              <v-card-title>{{ item.name }}</v-card-title>
              <v-card-subtitle>{{ item.price }}€</v-card-subtitle>
              <v-card-actions>
                <!-- Botón de activar/desactivar producto -->
                <v-btn @click="toggleProductStatus(item)" color="primary">
                  {{ item.active ? 'Desactivar' : 'Activar' }}
                </v-btn>
                <v-btn @click="openEditModal" max-width="500px">Edit</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Modal para crear un nuevo item -->
        <v-dialog v-model="createDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Crear Nuevo Item</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newItem.name" label="Nombre del Producto"></v-text-field>
              <v-text-field v-model="newItem.price" label="Precio" type="number"></v-text-field>
              
              <!-- Campo para subir la imagen del item -->
              <v-file-input
                v-model="newItem.imageFile"
                label="Selecciona la Imagen"
                accept="image/*"
                outlined
                :show-size="1000"
                hint="Máximo 1 MB"
              ></v-file-input>

              <!-- Vista previa de la imagen seleccionada -->
              <v-img v-if="newItem.imagePreview" :src="newItem.imagePreview" height="200px" class="mt-3"></v-img>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="createItem" color="success">Crear</v-btn>
              <v-btn @click="createDialog = false" color="red">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal para editar el item -->
      </v-container>
    </v-main>
  </v-app>

</template>

<script setup>
import { ref, onMounted } from 'vue';

const items = ref([]);
const loading = ref(true);

const createDialog = ref(false);
const editDialog = ref(false);
const newItem = ref({
  name: '',
  price: '',
  imageFile: null
});

const fetchItems = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/items'); // URL de la API de usuarios
    const data = await response.json();
    items.value = data.items;
    console.log(items.value);
  } catch (error) {
    console.error('Error al obtener productos:', error);
  } finally {
    loading.value = false; // Terminar la carga
  }
};

onMounted(() => {
  fetchItems();
});

// Función para alternar el estado de activo/inactivo de un producto
const toggleProductStatus = (product) => {
  product.active = !product.active;
};

// Función para abrir el modal de crear producto
const openCreateModal = () => {
  newItem.value = { name: '', price: '', imageFile: null }; // Limpiar los campos
  createDialog.value = true;
};

const openEditModal = () => {

}

// Función para manejar la carga del producto
const createItem = async () => {
  if (!newItem.value.name || !newItem.value.price || !newItem.value.imageFile) {
    alert('Por favor completa todos los campos.');
    return;
  }

  const formData = new FormData();
  formData.append('name', newItem.value.name);
  formData.append('price', newItem.value.price);
  formData.append('image', newItem.value.imageFile);

  try {
    const response = await fetch('http://localhost:3002/api/items/new-item', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert('Item creado con éxito');
      fetchItems();
      createDialog.value = false;
    } else {
      alert(data.message || 'Hubo un error al crear el item');
    }
  } catch (error) {
    console.error('Error al crear item:', error);
    alert('Hubo un problema con la conexión al servidor.');
  }
};
</script>

<style scoped>
/* Estilos opcionales */
</style>