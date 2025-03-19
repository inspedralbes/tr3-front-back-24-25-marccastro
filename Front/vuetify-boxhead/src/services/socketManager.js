const socket = new WebSocket("ws://localhost:3002");

// Evento cuando se conecta
socket.onopen = () => {
    console.log("Conectado al servidor WebSocket");
};

export const functionSocket = (character, newHealth, newSpeed, newDamage, newColor) => {
  if (socket.readyState === WebSocket.OPEN) {
    console.log("Enviado");
    const data = { name: character.value, health: newHealth.value, speed: newSpeed.value, damage: newDamage.value, color: newColor }; 
    socket.send(JSON.stringify(data));
  } else {
    console.error("WebSocket no está conectado.");
  }
};