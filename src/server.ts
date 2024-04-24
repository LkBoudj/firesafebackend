import http from "http";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mainDb from "./configs/db/mongoose";
//import { StreamServer } from "node-rtsp-stream";
const port = process.env.PORT || 3000;

// app.get("/start-stream", (req, res) => {
//   // Start streaming
//   StreamServer.start({
//     name: "stream1",
//     url: "rtsp://your-stream-url",
//   });
// });

// initialize database
mainDb();
// create server
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`starting server http://localhost:${port}`);
});
