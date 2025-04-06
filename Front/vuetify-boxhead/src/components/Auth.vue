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
import { ref } from 'vue'; // Importa 'ref' de Vue para crear referencias reactivas
import { useRouter } from 'vue-router'; // Importa 'useRouter' para navegar entre rutas

const router = useRouter(); // Inicializa el enrutador de Vue para redirigir a otras rutas
const isLogin = ref(true); // Define una referencia reactiva para determinar si el usuario está en la pantalla de login o registro
const username = ref(''); // Referencia reactiva para el nombre de usuario (solo en registro)
const email = ref(''); // Referencia reactiva para el correo electrónico
const password = ref(''); // Referencia reactiva para la contraseña
const confirmPassword = ref(''); // Referencia reactiva para confirmar la contraseña (solo en registro)
const showPassword = ref(false); // Controla la visibilidad de la contraseña (si está oculta o visible)
const valid = ref(false); // Define una referencia para la validez del formulario
const form = ref(null); // Referencia para el formulario, que se usará para validar el formulario

// Función que maneja el envío del formulario
const submitForm = async () => {
  // Si la validación del formulario falla, no hacer nada
  if (!form.value.validate()) return;

  // Define la URL del endpoint según si el usuario está registrándose o iniciando sesión
  const endpoint = isLogin.value
    ? 'http://localhost:3002/api/users/login/administraction' // URL para iniciar sesión
    : 'http://localhost:3002/api/users/register/administraction'; // URL para registrarse

  // Prepara los datos del usuario, dependiendo de si es login o registro
  let userData = isLogin.value
    ? { email: email.value, password: password.value } // Solo email y contraseña para login
    : { username: username.value, email: email.value, password: password.value }; // Username, email y contraseña para registro

  try {
    // Realiza la solicitud HTTP al servidor con los datos del usuario
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Establece que el cuerpo de la solicitud será en formato JSON
      body: JSON.stringify(userData), // Convierte los datos del usuario a JSON
    });

    // Procesa la respuesta del servidor
    const data = await response.json();

    // Si la respuesta es exitosa (código 2xx), guarda el token en localStorage y redirige al dashboard
    if (response.ok) {
      localStorage.setItem('token', 'Admin'); // Guarda un token de sesión (solo de ejemplo, en producción usarías un token real)
      router.push('/dashboard'); // Redirige al dashboard
    } else {
      // Si no es exitosa, muestra un mensaje de error
      alert(data.message || "Error en autenticació");
    }
  } catch (error) {
    // Si ocurre un error durante la conexión, muestra un mensaje de error
    alert('Hi va haver un problema amb la connexió al servidor.');
  }
};
</script>