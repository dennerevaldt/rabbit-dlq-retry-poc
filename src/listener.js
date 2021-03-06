async function listener(channel, queue) {
  channel.prefetch(1);

  channel.consume(queue, function (msg) {
    if (!msg.properties.headers['x-death']) {
      console.log('[listener][0] try process message...');
      channel.nack(msg, false, false); // msg, allUpTo: false, requeue: false
    } else {
      let counter = msg.properties.headers['x-death'][0].count;
      console.log('[listener]['+counter+'] try process message...');
      
      if (counter == 4) {
        console.log('[listener] retry limit reached...', JSON.parse(msg.content.toString()));
        // TO DO: some strategy to save/notify fail
        channel.ack(msg);
      } else {
        channel.nack(msg, false, false); // msg, allUpTo: false, requeue: false
      }
    }
  });
}

async function listenerSetup(channel, configs) {
  // Dead Letter Exchange
  const queueDeadLetterOptions = {
    durable: true,
    arguments : {
      'x-dead-letter-exchange': configs.rabbitMQExchange,
      'x-dead-letter-routing-key': configs.rabbitMQRoutingKey,
      'x-queue-type': 'classic',
      'x-message-ttl': 15000,
    },
  };

  await channel.assertExchange(configs.rabbitMQDeadLetterExchange, 'direct', { durable: false });
  await channel.assertQueue(configs.rabbitMQDeadLetterQueue, queueDeadLetterOptions);
  await channel.bindQueue(configs.rabbitMQDeadLetterQueue, configs.rabbitMQDeadLetterExchange, configs.rabbitMQDeadLetterRoutingKey);
}

module.exports = {
  listener,
  listenerSetup,
}