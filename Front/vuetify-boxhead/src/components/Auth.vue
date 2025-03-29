<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-5" width="400">
      <v-card-title class="text-center text-h5">
        {{ isLogin ? "Iniciar Sesión" : "Registrarse" }}
      </v-card-title>

      <v-form ref="form" v-model="valid">
        <v-text-field
          v-if="!isLogin"
          v-model="username"
          label="Username"
          prepend-icon="mdi-account"
          outlined
        ></v-text-field>

        <v-text-field 
          v-model="email"
          label="Correo Electrónico"
          prepend-icon="mdi-email"
          outlined
        ></v-text-field>

        <v-text-field 
          v-model="password"
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="showPassword = !showPassword"
          outlined
        ></v-text-field>

        <v-text-field 
          v-if="!isLogin"
          v-model="confirmPassword"
          label="Confirmar Contraseña"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          outlined
        ></v-text-field>

        <v-btn block color="primary" class="mt-3" @click="submitForm">
          {{ isLogin ? "Ingresar" : "Registrarse" }}
        </v-btn>

        <v-btn text block color="secondary" class="mt-2" @click="isLogin = !isLogin">
          {{ isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión" }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLogin = ref(true);
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const valid = ref(false);
const form = ref(null);

const submitForm = async () => {
  if (!form.value.validate()) return;

  const endpoint = isLogin.value
    ? 'http://localhost:3002/api/users/login/administraction'
    : 'http://localhost:3002/api/users/register/administraction';

  let userData = isLogin.value
    ? { email: email.value, password: password.value }
    : { username: username.value, email: email.value, password: password.value };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Respuesta del servidor:', data);

      localStorage.setItem('token', 'Admin');
      
      router.push('/dashboard');
    } else {
      console.error('Error en la autenticación:', data);
      alert(data.message || 'Error en la autenticación');
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    alert('Hubo un problema con la conexión al servidor.');
  }
};
</script>