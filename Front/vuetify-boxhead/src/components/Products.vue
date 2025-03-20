<template>
  <v-container>
    <v-row>
      <!-- Listado de productos -->
      <v-col v-for="product in products" :key="product.id" cols="12" md="4">
        <v-card>
          <v-img :src="product.image" height="200px"></v-img>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-subtitle>\${{ product.price }}</v-card-subtitle>
          <v-card-actions>
            <!-- Botón de activar/desactivar producto -->
            <v-btn @click="toggleProductStatus(product)" color="primary">
              {{ product.active ? 'Desactivar' : 'Activar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botón para crear un nuevo producto -->
    <v-btn @click="openCreateModal" color="success" class="mt-4">Crear Producto</v-btn>

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
</template>

<script setup>
import { ref } from 'vue';

// Estado reactivo para la lista de productos
const products = ref([
  { id: 1, name: 'Producto 1', price: 19.99, image: 'https://via.placeholder.com/150', active: true },
  { id: 2, name: 'Producto 2', price: 29.99, image: 'https://via.placeholder.com/150', active: false },
  { id: 3, name: 'Producto 3', price: 39.99, image: 'https://via.placeholder.com/150', active: true },
]);

// Estado para el modal de crear producto
const createDialog = ref(false);
const newProduct = ref({
  name: '',
  price: '',
  imageFile: null, // El archivo de la imagen
  imagePreview: null // Vista previa de la imagen
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
const createProduct = () => {
  if (newProduct.value.name && newProduct.value.price && newProduct.value.imageFile) {
    const reader = new FileReader();

    // Vista previa de la imagen antes de cargarla
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      newProduct.value.imagePreview = imageDataUrl; // Guardamos la vista previa

      // Aquí se manejaría la subida del archivo al servidor
      const newId = products.value.length + 1; // Generar un nuevo ID simple
      products.value.push({
        id: newId,
        name: newProduct.value.name,
        price: parseFloat(newProduct.value.price),
        image: imageDataUrl, // Usamos la URL de la imagen generada
        active: true
      });

      createDialog.value = false; // Cerrar el modal
    };

    // Leer el archivo de imagen como URL de datos (Data URL)
    reader.readAsDataURL(newProduct.value.imageFile);
  } else {
    alert('Por favor completa todos los campos.');
  }
};
</script>

<style scoped>
/* Estilos opcionales */
</style>