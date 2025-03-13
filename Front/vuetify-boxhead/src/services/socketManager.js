const socket = new WebSocket("ws://localhost:3001");

// Evento cuando se conecta
socket.onopen = () => {
    console.log("Conectado al servidor WebSocket");
};

export const functionSocket = (enemy, newHealth, newSpeed, newDamage) => {
  if (socket.readyState === WebSocket.OPEN) {
    console.log("Enviado");
    const data = { name: enemy.value, health: newHealth.value, speed: newSpeed.value, damage: newDamage.value }; 
    socket.send(JSON.stringify(data));
  } else {
    console.error("WebSocket no está conectado.");
  }
};