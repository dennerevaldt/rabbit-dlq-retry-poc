const amqplib = require('./util/amqplib');

const { publisherSetup, publisher } = require('./publisher');
const { listenerSetup, listener } = require('./listener');

async function setup() {
  const configs = {
    // DQL params
    rabbitMQDeadLetterExchange: 'dlq.message.dx',
    rabbitMQDeadLetterRoutingKey: 'message.failed',
    rabbitMQDeadLetterQueue: 'message-dead-letter.queue',
    // Queue params
    rabbitMQQueue: 'message.queue',
    rabbitMQExchange: 'message.dx',
    rabbitMQRoutingKey: 'created.message',
  };

  // Get new channel
  const channel = await amqplib.getChannel();

  // Start publisher setup
  await publisherSetup(channel, configs);

  // Start listener setup
  await listenerSetup(channel, configs);

  publisher(channel, configs.rabbitMQExchange, configs.rabbitMQRoutingKey, { test: 'OK', date: Date() });

  listener(channel, configs.rabbitMQQueue);
}

setImmediate(() => {
  setup();
  console.log('Running');
});