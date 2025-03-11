import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export const functionSocket = (newSpeed, newDamage) => {
    if(socket.connected) {
        socket.emit("updateCharacter", { speed: newSpeed.value, damage: newDamage.value});
    }
    else console.error("No");
}