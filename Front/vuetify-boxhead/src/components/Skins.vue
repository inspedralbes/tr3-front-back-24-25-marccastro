<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>Skins</v-toolbar-title>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <v-alert v-if="loading" type="info" dismissible>
          Cargando skins...
        </v-alert>
        <v-row>
          <!-- Botón para crear un nuevo skin -->
          <v-col cols="12" md="4">
            <v-btn @click="openCreateModal" color="success" class="mt-4">Crear Skin</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <!-- Listado de Skins -->
          <v-col v-for="skin in skins" v-if="!loading && skins.length" :key="skin.id" cols="12" md="4">
            <v-card>
              <v-img :src="`http://localhost:3002${skin.imagePath}`" height="200px"></v-img>
              <v-card-title>{{ skin.name }}</v-card-title>
              <v-card-subtitle>{{ skin.price }}€</v-card-subtitle>
              <v-card-actions>
                <!-- Botón de activar/desactivar producto -->
                <v-btn @click="toggleProductStatus(skin)" color="primary">
                  {{ skin.active ? 'Desactivar' : 'Activar' }}
                </v-btn>
                <v-btn @click="openEditModal(skin)" max-width="500px">Edit</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Modal para crear un nuevo skin -->
        <v-dialog v-model="createDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Crear Nuevo Skin</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newSkin.name" label="Nombre de la Skin"></v-text-field>
              <v-text-field v-model="newSkin.price" label="Precio" type="number"></v-text-field>
              
              <!-- Campo para subir la imagen del Skin -->
              <v-file-input
                v-model="newSkin.imageFile"
                label="Selecciona la Imagen"
                accept="image/*"
                outlined
                :show-size="1000"
                hint="Máximo 1 MB"
              ></v-file-input>

              <!-- Campo para subir el asset bundler -->
              <v-file-input
                v-model="newSkin.assetBundleFile"
                label="Selecciona el Asset Bundler"
                accept=".bundle,.assetbundle"
                outlined
                :show-size="5000"
                hint="Máximo 5 MB"
              ></v-file-input>

              <!-- Vista previa de la imagen seleccionada -->
              <v-img v-if="newSkin.imagePreview" :src="newSkin.imagePreview" height="200px" class="mt-3"></v-img>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="createSkin" color="success">Crear</v-btn>
              <v-btn @click="createDialog = false" color="red">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal para editar una skin -->
        <v-dialog v-model="editDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Editar Skin</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newEditSkin.name" label="Nombre de la Skin"></v-text-field>
              <v-text-field v-model="newEditSkin.price" label="Precio" type="number"></v-text-field>
              
              <!-- Campo para subir la imagen del Skin -->
              <v-file-input
                v-model="newEditSkin.imageFile"
                label="Selecciona la Imagen"
                accept="image/*"
                outlined
                :show-size="1000"
                hint="Máximo 1 MB"
              ></v-file-input>

              <!-- Campo para subir el asset bundler -->
              <v-file-input
                v-model="newEditSkin.assetBundleFile"
                label="Selecciona el Asset Bundler"
                accept=".bundle,.assetbundle"
                outlined
                :show-size="5000"
                hint="Máximo 5 MB"
              ></v-file-input>

              <!-- Vista previa de la imagen seleccionada -->
              <v-img v-if="newEditSkin.imagePreview" :src="newEditSkin.imagePreview" height="200px" class="mt-3"></v-img>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="editSkin" color="success">Editar</v-btn>
              <v-btn @click="editDialog = false" color="red">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const skins = ref([]);
const loading = ref(true);
const editDialog = ref(false);
const createDialog = ref(false);
const newSkin = ref({
  name: '',
  price: '',
  imageFile: null,
  assetBundleFile: null
});

const newEditSkin = ref({
  id: 0,
  name: '',
  price: '',
  imageFile: null,
  assetBundleFile: null
});

const fetchSkins = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/skins'); // URL de la API de usuarios
    const data = await response.json();
    console.log(data);
    if (data.skins) {
      skins.value = data.skins;
    } else {
      skins.value = [];
    }
  } catch (error) {
    console.error('Error al obtener productos:', error);
  } finally {
    loading.value = false; // Terminar la carga
  }
};

onMounted(() => {
  fetchSkins();
});

// Función para alternar el estado de activo/inactivo de un producto
const toggleProductStatus = (skin) => {
  skin.active = !skin.active;
};

// Función para abrir el modal de crear producto
const openCreateModal = () => {
  newSkin.value = { name: '', price: '', imageFile: null, assetBundleFile: null }; // Limpiar los campos
  createDialog.value = true;
};

const openEditModal = async (skin) => {
  newEditSkin.value = { 
    id: skin.id,
    name: skin.name,
    price: skin.price,
    imageFile: null, // Deberías dejarlo en null ya que la imagen se actualiza
    assetBundleFile: null, // Similar para el asset
  };
  editDialog.value = true;
}

// Función para manejar la carga del producto
const createSkin = async () => {
  if (!newSkin.value.name && !newSkin.value.price && !newSkin.value.imageFile && !newSkin.value.assetBundleFile) {
    alert('Por favor completa todos los campos.');
    return;
  }

  const formData = new FormData();
  formData.append('name', newSkin.value.name);
  formData.append('price', newSkin.value.price);
  formData.append('image', newSkin.value.imageFile);
  formData.append('assetBundle', newSkin.value.assetBundleFile);

  try {
    const response = await fetch('http://localhost:3002/api/skins/new-skin', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert('Skin creado con éxito');
      fetchSkins();
      createDialog.value = false;
    } else {
      alert(data.message || 'Hubo un error al crear el skin');
    }
  } catch (error) {
    console.error('Error al crear skin:', error);
    alert('Hubo un problema con la conexión al servidor.');
  }
};

const editSkin = async () => {
  console.log(newEditSkin.value.id);
  const formData = new FormData();
  formData.append('id', newEditSkin.value.id);
  formData.append('name', newEditSkin.value.name);
  formData.append('price', newEditSkin.value.price);
  formData.append('image', newEditSkin.value.imageFile);
  formData.append('assetBundle', newEditSkin.value.assetBundleFile);

  try {
    const response = await fetch('http://localhost:3002/api/skins/edit-skin', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert('Skin editado con éxito');
      fetchSkins();
      editDialog.value = false;
    } else {
      alert(data.message || 'Hubo un error al editar la skin');
    }
  } catch (error) {
    console.error('Error al editar la skin:', error);
    alert('Hubo un problema con la conexión al servidor.');
  }
};
</script>