const socket = new WebSocket("ws://localhost:3002");

// Evento cuando se conecta
socket.onopen = () => {
  console.log("Conectado al servidor WebSocket");
};

export const functionSocket = (save, character, newHealth, newSpeed, newDamage, newColor) => {
  if (socket.readyState === WebSocket.OPEN) {
    console.log("Enviado");

    // Accediendo a los valores de los refs con .value
    let data = {
      save: save.value, // Usamos .value para acceder al valor del ref 'save'
      name: character.value, // Usamos .value para acceder al valor del ref 'character'
      health: newHealth.value, // Usamos .value para acceder al valor del ref 'newHealth'
      speed: newSpeed.value, // Usamos .value para acceder al valor del ref 'newSpeed'
      damage: newDamage.value, // Usamos .value para acceder al valor del ref 'newDamage'
      color: newColor // Aquí ya no es necesario .value porque `newColor` probablemente sea una cadena (string) directamente.
    };

    console.log(data);

    // Enviar los datos como un string JSON
    socket.send(JSON.stringify(data));
  } else {
    console.error("WebSocket no está conectado.");
  }
};