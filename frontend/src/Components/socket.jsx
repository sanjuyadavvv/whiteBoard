import {io} from "socket.io-client"


const socket= io("https://collabboard-cseg.onrender.com", {
  transports: ["websocket"],
});

export default socket