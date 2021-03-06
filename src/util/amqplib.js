const { connect } = require('amqplib');

require('dotenv').config();

let connection;

const {
  AMQP_PROTOCOL,
  AMQP_HOSTNAME,
  AMQP_PORT,
  AMQP_USERNAME,
  AMQP_PASSWORD,
  AMQP_VHOST,
} = process.env;

const config = {
  protocol: AMQP_PROTOCOL,
  hostname: AMQP_HOSTNAME,
  port: AMQP_PORT,
  username: AMQP_USERNAME,
  password: AMQP_PASSWORD,
  vhost: AMQP_VHOST,
};

const getConnection = async () => {
  if (!connection) {
    connection = await connect(config).catch((err) => {
      console.error(err)
      process.exit(1);
    });
  }
  return connection;
};

const getChannel = async () => {
  const conn = await getConnection();
  const channel = await conn.createChannel();

  return channel;
}

const getConfirmChannel = async () => {
  const conn = await getConnection();
  const channel = await conn.createConfirmChannel();

  return channel;
}

module.exports = {
  getChannel,
  getConfirmChannel,
};