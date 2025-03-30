const socket = new WebSocket("ws://localhost:3002");

// Evento cuando se conecta
socket.onopen = () => {
  console.log("Conectado al servidor WebSocket");
  socket.send(JSON.stringify({
    event_backend: "register",
    payload: { id: "client_vue", tipo: "vuetify" }
  }));
};

export const functionSocket = (save, character, newHealth, newSpeed, newDamage, newColor) => {
  if (socket.readyState === WebSocket.OPEN) {
    console.log("Enviado");

    let data = {
      event_backend: "send-to-unity",  // Agregamos el evento
      event_unity: "stats-update",
      payload: { // Metemos los datos dentro de "payload"
        save: save.value,
        name: character.value,
        health: newHealth.value,
        speed: newSpeed.value,
        damage: newDamage.value,
        color: newColor
      }
    };

    console.log(data);

    socket.send(JSON.stringify(data)); // Enviar JSON correctamente estructurado
  } else {
    console.error("WebSocket no está conectado.");
  }
};

export const functionSocketRestart = () => {
  if(socket.readyState === WebSocket.OPEN) {
    console.log("Enviado2");

    let data = {
      event_backend: "send-to-unity",
      event_unity: "stats_restart",
      payload: {
        save: null,
        name: null,
        health: null,
        speed: null,
        damage: null,
        color: null
      }
    }

    socket.send(JSON.stringify(data));
  }
  else {
    console.error("WebSocket no está conectado.");
  }
}