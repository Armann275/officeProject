const RabbitUrl = "amqps://lqrtstup:9gJBrDGgSdKaQfhvfenqr-WPXpLA_rKl@chameleon.lmq.cloudamqp.com/lqrtstup"
require('dotenv').config();
const amqp = require('amqplib');
const EXCHANGE = 'users_topic_exchange';


async function publish(routingKey, message) {
  const connection = await amqp.connect(RabbitUrl);
  const channel = await connection.createChannel();

  // Use topic exchange (not direct)
  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

  channel.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log(`📤 Sent to [${routingKey}]:`, message);

  await channel.close();
  await connection.close();
}

module.exports = {publish}