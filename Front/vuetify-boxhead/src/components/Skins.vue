<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>Skins</v-toolbar-title>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <v-alert v-if="loading" type="info" dismissible>
          Cargan skins...
        </v-alert>
        <v-row>
          <v-col cols="12" md="4">
            <v-btn @click="openCreateModal" color="success" class="mt-4">Crear Skin</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="skin in skins" v-if="!loading && skins.length" :key="skin.id" cols="12" md="4">
            <v-card>
              <v-img :src="`http://localhost:3002${skin.imagePath}`" height="200px"></v-img>
              <v-card-title>{{ skin.name }}</v-card-title>
              <v-card-subtitle>{{ skin.price }}€</v-card-subtitle>
              <v-card-actions>
                <v-btn @click="openEditModal(skin)" max-width="500px">Edita</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="createDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Crear Nova Skin</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newSkin.name" label="Nom de la Skin"></v-text-field>
              <v-text-field v-model="newSkin.price" label="Preu" type="number"></v-text-field>
              
              <v-file-input
                v-model="newSkin.imageFile"
                label="Selecciona una imatge"
                outlined
                :show-size="1000"
                hint="Màxim 1 MB"
              ></v-file-input>

              <v-file-input
                v-model="newSkin.assetBundleFile"
                label="Selecciona un fitxer Asset Bundler"
                outlined
                :show-size="5000"
                hint="Màxim 5 MB"
              ></v-file-input>

              <v-img v-if="newSkin.imagePreview" :src="newSkin.imagePreview" height="200px" class="mt-3"></v-img>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="createSkin" color="success">Crear</v-btn>
              <v-btn @click="createDialog = false" color="red">Cancel·la</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="editDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edita Skin</span>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="newEditSkin.name" label="Nom de la Skin"></v-text-field>
              <v-text-field v-model="newEditSkin.price" label="Preu" type="number"></v-text-field>
              
              <v-file-input
                v-model="newEditSkin.imageFile"
                label="Selecciona una imatge"
                outlined
                :show-size="1000"
                hint="Màxim 1 MB"
              ></v-file-input>

              <v-file-input
                v-model="newEditSkin.assetBundleFile"
                label="Selecciona un fitxer Asset Bundler"
                outlined
                :show-size="5000"
                hint="Màxim 5 MB"
              ></v-file-input>

              <v-img v-if="newEditSkin.imagePreview" :src="newEditSkin.imagePreview" height="200px" class="mt-3"></v-img>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="editSkin" color="success">Edita</v-btn>
              <v-btn @click="editDialog = false" color="red">Cancel·la</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Importa 'ref' para crear variables reactivas y 'onMounted' para ejecutar código al montar el componente

// Variables reactivas para gestionar el estado de la aplicación
const skins = ref([]); // 'skins' almacena la lista de 'skins' obtenida del servidor
const loading = ref(true); // 'loading' indica si los datos aún se están cargando
const editDialog = ref(false); // 'editDialog' controla si el modal de edición está visible
const createDialog = ref(false); // 'createDialog' controla si el modal de creación está visible

// Variables para almacenar la información de la nueva skin o la skin editada
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

// Función asincrónica para obtener las skins del servidor
const fetchSkins = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/skins');
    const data = await response.json(); // Convierte la respuesta a formato JSON

    if (data.skins) {
      skins.value = data.skins; // Si la respuesta contiene skins, se asignan a la variable reactiva 'skins'
    } else {
      skins.value = []; // Si no hay skins, se asigna un arreglo vacío
    }
  } catch (error) {
    console.error('Error al obtener productos:', error); // Si hay un error en la solicitud, se muestra en la consola
  } finally {
    loading.value = false; // Al finalizar la solicitud, se establece 'loading' a false
  }
};

// Se llama a la función 'fetchSkins' cuando el componente se monta
onMounted(() => {
  fetchSkins();
});

// Función para abrir el modal de creación de una nueva skin
const openCreateModal = () => {
  // Inicializa los campos de 'newSkin' con valores vacíos
  newSkin.value = { name: '', price: '', imageFile: null, assetBundleFile: null };
  createDialog.value = true; // Muestra el modal de creación
};

// Función para abrir el modal de edición de una skin existente
const openEditModal = async (skin) => {
  // Inicializa los campos de 'newEditSkin' con la información de la skin seleccionada
  newEditSkin.value = { 
    id: skin.id,
    name: skin.name,
    price: skin.price,
    imageFile: null,
    assetBundleFile: null,
  };
  editDialog.value = true; // Muestra el modal de edición
};

// Función para crear una nueva skin
const createSkin = async () => {
  // Valida si todos los campos están completos
  if (!newSkin.value.name && !newSkin.value.price && !newSkin.value.imageFile && !newSkin.value.assetBundleFile) {
    alert('Si us plau completa tots els camps.'); // Muestra un mensaje de error si falta algún campo
    return;
  }

  // Crea un objeto FormData para enviar los datos de la skin al servidor
  const formData = new FormData();
  formData.append('name', newSkin.value.name);
  formData.append('price', newSkin.value.price);
  formData.append('image', newSkin.value.imageFile);
  formData.append('assetBundle', newSkin.value.assetBundleFile);

  try {
    // Realiza una solicitud POST para crear la skin
    const response = await fetch('http://localhost:3002/api/skins/new-skin', {
      method: 'POST',
      body: formData // Envía los datos como FormData
    });

    const data = await response.json(); // Convierte la respuesta a formato JSON

    if (response.ok) {
      alert('Skin creat amb èxit'); // Muestra un mensaje de éxito si la skin se crea correctamente
      fetchSkins(); // Vuelve a obtener la lista de skins actualizada
      createDialog.value = false; // Cierra el modal de creación
    } else {
      alert(data.message || "Hi va haver un error en crear la skin"); // Si hay un error, muestra el mensaje correspondiente
    }
  } catch (error) {
    alert('Hi va haver un problema amb la connexió al servidor.'); // Si hay un problema de conexión, muestra un mensaje de error
  }
};

// Función para editar una skin existente
const editSkin = async () => {
  console.log(newEditSkin.value.id); // Muestra el ID de la skin que se está editando (solo para depuración)

  // Crea un objeto FormData para enviar los datos de la skin editada al servidor
  const formData = new FormData();
  formData.append('id', newEditSkin.value.id);
  formData.append('name', newEditSkin.value.name);
  formData.append('price', newEditSkin.value.price);
  formData.append('image', newEditSkin.value.imageFile);
  formData.append('assetBundle', newEditSkin.value.assetBundleFile);

  try {
    // Realiza una solicitud POST para editar la skin
    const response = await fetch('http://localhost:3002/api/skins/edit-skin', {
      method: 'POST',
      body: formData // Envía los datos como FormData
    });

    const data = await response.json(); // Convierte la respuesta a formato JSON

    if (response.ok) {
      alert('Skin editado con éxito'); // Muestra un mensaje de éxito si la skin se edita correctamente
      fetchSkins(); // Vuelve a obtener la lista de skins actualizada
      editDialog.value = false; // Cierra el modal de edición
    } else {
      alert(data.message || 'Hubo un error al editar la skin'); // Si hay un error, muestra el mensaje correspondiente
    }
  } catch (error) {
    alert('Hubo un problema con la conexión al servidor.'); // Si hay un problema de conexión, muestra un mensaje de error
  }
};
</script>