const {publish} = require('./RabbitMq/producer');

const { WebSocketServer }  = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
  console.log('✅ Client connected');

  // Send a welcome message right after connection
  ws.send(JSON.stringify({ message: 'Hello from server 👋' }));

  // When the client (Postman) sends a message
  ws.on('message', async message => {
    await publish("user.create",JSON.parse(message.toString()));
    // const msg = JSON.parse(message.toString())
    // console.log('📩 Received from client:', message.toString());
    
    // const user = await addUser(msg.name,msg.username,msg.password);
    // console.log("user" + user);
    
    // const user = await addUser(message.name,message.username,message.password);
    // console.log(user);
    
    // Respond back to Postman
    ws.send(JSON.stringify({}));
  });

  // Handle disconnection
  ws.on('close', () => console.log('❌ Client disconnected'));
});

console.log('🚀 WebSocket server running on ws://localhost:8080');
