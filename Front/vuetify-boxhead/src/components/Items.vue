<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>Items</v-toolbar-title>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <v-alert v-if="loading" type="info" dismissible>
          Cargando usuarios...
        </v-alert>
        <v-row>
          <!-- Botón para crear un nuevo producto -->
          <v-col cols="12" md="4">
            <v-btn @click="openCreateModal" color="success" class="mt-4">Crear Producto</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- Listado de productos -->
          <v-col v-for="product in products" v-if="!loading && products.length" :key="product.id" cols="12" md="4">
            <v-card>
              <v-img :src="`http://localhost:3002${product.imagePath}`" height="200px"></v-img>
              <v-card-title>{{ product.name }}</v-card-title>
              <v-card-subtitle>{{ product.price }}€</v-card-subtitle>
              <v-card-actions>
                <!-- Botón de activar/desactivar producto -->
                <v-btn @click="toggleProductStatus(product)" color="primary">
                  {{ product.active ? 'Desactivar' : 'Activar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Modal para crear un nuevo producto -->
        <v-dialog v-model="createDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Crear Nuevo Producto</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newProduct.name" label="Nombre del Producto"></v-text-field>
              <v-text-field v-model="newProduct.price" label="Precio" type="number"></v-text-field>
              
              <!-- Campo para subir la imagen del producto -->
              <v-file-input
                v-model="newProduct.imageFile"
                label="Selecciona la Imagen"
                accept="image/*"
                outlined
                :show-size="1000"
                hint="Máximo 1 MB"
              ></v-file-input>

              <!-- Vista previa de la imagen seleccionada -->
              <v-img v-if="newProduct.imagePreview" :src="newProduct.imagePreview" height="200px" class="mt-3"></v-img>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="createProduct" color="success">Crear</v-btn>
              <v-btn @click="createDialog = false" color="red">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>

</template>

<script setup>
import { ref, onMounted } from 'vue';

const products = ref([]);
const loading = ref(true);

const createDialog = ref(false);
const newProduct = ref({
  name: '',
  price: '',
  imageFile: null,
  imagePreview: null
});

const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/items'); // URL de la API de usuarios
    const data = await response.json();
    products.value = data;
    console.log(products.value);
  } catch (error) {
    console.error('Error al obtener productos:', error);
  } finally {
    loading.value = false; // Terminar la carga
  }
};

onMounted(() => {
  fetchProducts();
});

// Función para alternar el estado de activo/inactivo de un producto
const toggleProductStatus = (product) => {
  product.active = !product.active;
};

// Función para abrir el modal de crear producto
const openCreateModal = () => {
  newProduct.value = { name: '', price: '', imageFile: null, imagePreview: null }; // Limpiar los campos
  createDialog.value = true;
};

// Función para manejar la carga del producto
const createProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.price || !newProduct.value.imageFile) {
    alert('Por favor completa todos los campos.');
    return;
  }

  const formData = new FormData();
  formData.append('name', newProduct.value.name);
  formData.append('price', newProduct.value.price);
  formData.append('image', newProduct.value.imageFile);

  try {
    const response = await fetch('http://localhost:3002/api/items', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert('Item creado con éxito');
      fetchProducts();
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