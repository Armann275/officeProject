// const pkg = require('pg')

// const { Client } = pkg;

// async function connectDB() {
//   const client = new Client({
//     host: 'localhost',
//     port: 5433,
//     user: 'postgres',
//     password: 'poker123',
//     database: 'postgres',
//   });

//   try {
//     await client.connect();
//     console.log('✅ Connected to PostgreSQL successfully!');

//     // Test query
//     const res = await client.query('SELECT NOW() AS current_time;');
//     console.log('🕒 Server time:', res.rows[0].current_time);

//   } catch (err) {
//     console.error('❌ Connection error:', err.message);
//   } finally {
//     await client.end();
//     console.log('🔌 Connection closed');
//   }
// }

// connectDB();
const {client,connectDB} = require('./db/connectDb');
connectDB();



const { WebSocketServer }  = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });
  
wss.on('connection', ws => {
  console.log('✅ Client connected');

  // Send a welcome message right after connection
  ws.send(JSON.stringify({ message: 'Hello from server 👋' }));

  // When the client (Postman) sends a message
  ws.on('message', message => {
    console.log('📩 Received from client:', message.toString());

    // Respond back to Postman
    ws.send(JSON.stringify({
      reply: 'Message received successfully!',
      yourMessage: message.toString()
    }));
  });

  // Handle disconnection
  ws.on('close', () => console.log('❌ Client disconnected'));
});

console.log('🚀 WebSocket server running on ws://localhost:8080');
