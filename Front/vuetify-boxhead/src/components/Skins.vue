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
              <v-img :src="`http://boxheadcontrol.dam.inspedralbes.cat:3002${skin.imagePath}`" height="200px"></v-img>
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
    const response = await fetch('http://boxheadcontrol.dam.inspedralbes.cat:3002/api/skins');
    const data = await response.json();
    if (data.skins) {
      skins.value = data.skins;
    } else {
      skins.value = [];
    }
  } catch (error) {
    console.error('Error al obtener productos:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSkins();
});

const openCreateModal = () => {
  newSkin.value = { name: '', price: '', imageFile: null, assetBundleFile: null };
  createDialog.value = true;
};

const openEditModal = async (skin) => {
  newEditSkin.value = { 
    id: skin.id,
    name: skin.name,
    price: skin.price,
    imageFile: null,
    assetBundleFile: null,
  };
  editDialog.value = true;
}

const createSkin = async () => {
  if (!newSkin.value.name && !newSkin.value.price && !newSkin.value.imageFile && !newSkin.value.assetBundleFile) {
    alert('Si us plau completa tots els camps.');
    return;
  }

  const formData = new FormData();
  formData.append('name', newSkin.value.name);
  formData.append('price', newSkin.value.price);
  formData.append('image', newSkin.value.imageFile);
  formData.append('assetBundle', newSkin.value.assetBundleFile);

  try {
    const response = await fetch('http://boxheadcontrol.dam.inspedralbes.cat:3002/api/skins/new-skin', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert('Skin creat amb èxit');
      fetchSkins();
      createDialog.value = false;
    } else {
      alert(data.message || "Hi va haver un error en crear la skin");
    }
  } catch (error) {
    alert('Hi va haver un problema amb la connexió al servidor.');
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
    const response = await fetch('http://boxheadcontrol.dam.inspedralbes.cat:3002/api/skins/edit-skin', {
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
    alert('Hubo un problema con la conexión al servidor.');
  }
};
</script>