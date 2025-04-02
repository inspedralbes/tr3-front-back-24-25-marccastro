const socket = new WebSocket("ws://boxheadcontrol.dam.inspedralbes.cat:3002");

socket.onopen = () => {
  console.log("Conectado al servidor WebSocket");
  socket.send(JSON.stringify({
    event_backend: "register",
    payload: { id: "client_vue", tipo: "vuetify" }
  }));
};

export const functionUpdateEnemy = (save, nameCharacter, newHealth, newSpeed, newDamage, newColor) => {
  if (socket.readyState === WebSocket.OPEN) {

    let data = {
      event_backend: "send-to-unity",
      event_unity: "stats-update",
      payload: {
        save: save.value,
        name: nameCharacter,
        health: newHealth.value,
        speed: newSpeed.value,
        damage: newDamage.value,
        color: newColor
      }
    };

    socket.send(JSON.stringify(data));
    alert("Enviat noves característiques amb èxit");
  } else {
    console.error("WebSocket no está conectado.");
  }
};

export const functionUpdatePlayer = (nameCharacter, newHealth, newSpeed) => {
  if (socket.readyState === WebSocket.OPEN) {
    let data = {
      event_backend: "send-to-unity",
      event_unity: "stats-update",
      payload: {
        save: null,
        name: nameCharacter,
        health: newHealth.value,
        speed: newSpeed.value,
        damage: null,
        color: null
      }
    };

    socket.send(JSON.stringify(data));
    alert("Guardat les noves característiques amb èxit");
  } else {
    console.error("WebSocket no está conectado.");
  }
}

export const functionSocketRestart = () => {
  if(socket.readyState === WebSocket.OPEN) {
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
    alert("Restauració de les característiques amb èxit");
  }
  else {
    console.error("WebSocket no está conectado.");
  }
}