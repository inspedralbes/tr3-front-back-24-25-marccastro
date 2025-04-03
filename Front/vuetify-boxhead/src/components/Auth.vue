<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-5" width="400">
      <v-card-title class="text-center text-h5">
        {{ isLogin ? "Iniciar Sessió" : "Registrar-se" }}
      </v-card-title>

      <v-form ref="form" v-model="valid">
        <v-text-field
          v-if="!isLogin"
          v-model="username"
          label="Nom d'usuari"
          prepend-icon="mdi-account"
          outlined
        ></v-text-field>

        <v-text-field 
          v-model="email"
          label="Email"
          prepend-icon="mdi-email"
          outlined
        ></v-text-field>

        <v-text-field 
          v-model="password"
          label="Contrasenya"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="showPassword = !showPassword"
          outlined
        ></v-text-field>

        <v-text-field 
          v-if="!isLogin"
          v-model="confirmPassword"
          label="Confirmar Contrasenya"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          outlined
        ></v-text-field>

        <v-btn block color="primary" class="mt-3" @click="submitForm">
          {{ isLogin ? "Ingressar" : "Registrar-se" }}
        </v-btn>

        <v-btn text block color="secondary" class="mt-2" @click="isLogin = !isLogin">
          {{ isLogin ? "No tens compte? Registra't" : "Ja tens compte? Inicia sessió" }}
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
      localStorage.setItem('token', 'Admin');
      
      router.push('/dashboard');
    } else {
      alert(data.message || "Error en autenticació");
    }
  } catch (error) {
    alert('Hi va haver un problema amb la connexió al servidor.');
  }
};
</script>