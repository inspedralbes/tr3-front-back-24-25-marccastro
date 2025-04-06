// Crea una conexión WebSocket al servidor que corre en el puerto 3002
const socket = new WebSocket("ws://localhost:3002");

// Evento que se ejecuta cuando se establece la conexión con éxito
socket.onopen = () => {
  console.log("Conectado al servidor WebSocket");

  // Envía un mensaje al servidor indicando que este cliente se ha registrado
  socket.send(JSON.stringify({
    event_backend: "register", // Tipo de evento para el backend
    payload: { id: "client_vue", tipo: "vuetify" } // Identificador del cliente
  }));
};

// Función para actualizar las estadísticas de un enemigo
export const functionUpdateEnemy = (save, nameCharacter, newHealth, newSpeed, newDamage, newColor) => {
  // Verifica si la conexión WebSocket está abierta
  if (socket.readyState === WebSocket.OPEN) {

    // Construye el mensaje con los nuevos valores del enemigo
    let data = {
      event_backend: "send-to-unity", // Tipo de evento para el backend
      event_unity: "stats-update",    // Evento que Unity reconocerá
      payload: {
        save: save.value,             // Nombre de la partida o archivo de guardado
        name: nameCharacter,          // Nombre del enemigo
        health: newHealth.value,      // Nueva salud
        speed: newSpeed.value,        // Nueva velocidad
        damage: newDamage.value,      // Nuevo daño
        color: newColor               // Nuevo color
      }
    };

    // Envía los datos al servidor WebSocket
    socket.send(JSON.stringify(data));
    alert("Enviat noves característiques amb èxit");
  } else {
    console.error("WebSocket no está conectado.");
  }
};

// Función para actualizar estadísticas de un jugador (sin daño ni color)
export const functionUpdatePlayer = (nameCharacter, newHealth, newSpeed) => {
  if (socket.readyState === WebSocket.OPEN) {
    let data = {
      event_backend: "send-to-unity",
      event_unity: "stats-update",
      payload: {
        save: null,                 // No guarda en archivo
        name: nameCharacter,        // Nombre del personaje jugador
        health: newHealth.value,    // Nueva salud
        speed: newSpeed.value,      // Nueva velocidad
        damage: null,               // Daño no aplicable al jugador
        color: null                 // Color no aplicable al jugador
      }
    };

    socket.send(JSON.stringify(data));
    alert("Guardat les noves característiques amb èxit");
  } else {
    console.error("WebSocket no está conectado.");
  }
}

// Función para reiniciar las estadísticas (tanto de jugador como enemigos)
export const functionSocketRestart = () => {
  if (socket.readyState === WebSocket.OPEN) {
    let data = {
      event_backend: "send-to-unity",
      event_unity: "stats_restart", // Evento especial para reiniciar estadísticas
      payload: {
        save: null,
        name: null,
        health: null,
        speed: null,
        damage: null,
        color: null
      }
    };

    socket.send(JSON.stringify(data));
    alert("Restauració de les característiques amb èxit");
  } else {
    console.error("WebSocket no está conectado.");
  }
}