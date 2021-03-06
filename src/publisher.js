function publisher(channel, exchange, routingKey, message) {
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log('[publisher] message published with success...');
}

async function publisherSetup(channel, configs) {
  // Prepare Queue and DLQ Exchange/RK
  const queueOptions = {
    durable: false,
    arguments : {
        "x-dead-letter-exchange": configs.rabbitMQDeadLetterExchange,
        "x-dead-letter-routing-key": configs.rabbitMQDeadLetterRoutingKey,
    },
  };

  await channel.assertExchange(configs.rabbitMQExchange, 'direct', { durable: false });
  await channel.assertQueue(configs.rabbitMQQueue, queueOptions);
  await channel.bindQueue(configs.rabbitMQQueue, configs.rabbitMQExchange, configs.rabbitMQRoutingKey);
}

module.exports = {
  publisher,
  publisherSetup,
};