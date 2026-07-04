 import dotenv from 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/databse.js';
import http from 'http'
import {initSocket} from './src/sockets/server.socket.js'

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB()
.catch((error) => {
  console.error('Failed to connect to the database:', error);
});



 httpServer.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
 });
