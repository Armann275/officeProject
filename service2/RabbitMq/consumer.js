const amqp = require('amqplib');
require('dotenv').config();

const RABBIT_URL = "amqps://lqrtstup:9gJBrDGgSdKaQfhvfenqr-WPXpLA_rKl@chameleon.lmq.cloudamqp.com/lqrtstup";
const EXCHANGE = 'users_topic_exchange';
const QUEUE = 'user_actions_queue';
const ROUTING_PATTERN = 'user.*'; // Matches user.add, user.read, user.delete

const EXCHANGE2 = "response"
const {handler} = require('../handlers/handler');
// const handlers = require('./services/handler');

async function consumeUsers() {
  const connection = await amqp.connect(RABBIT_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
  await channel.assertQueue(QUEUE, { durable: true });
  await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_PATTERN);

  console.log(`👂 Listening on '${QUEUE}' for pattern '${ROUTING_PATTERN}'`);

  channel.consume(QUEUE, async (msg) => {
    console.log(JSON.parse(msg.content.toString()));
    
    
    if (!msg) return;

    const routingKey = msg.fields.routingKey;
    const data = JSON.parse(msg.content.toString());

    console.log(`📩 Received [${routingKey}]:`, data);
    console.log(routingKey);
    
    const handlerr = handler[routingKey];
    console.log(handlerr);
    
    if (handlerr) {
      try {
       const user = await handlerr(data);
       console.log(user);
        await channel.assertExchange(EXCHANGE2, 'topic', { durable: true });

        channel.publish(EXCHANGE2, `response.${routingKey}`, Buffer.from(JSON.stringify(user)), { persistent: true });
        
      } catch (err) {
        console.error(`❌ Error handling ${routingKey}:`, err);
      }
    } 

    channel.ack(msg);
  });
}

consumeUsers().catch(console.error);