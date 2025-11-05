import {
  insertGasLog
} from './helpers.js';
let amqp = require('amqplib/callback_api');

const amqpUrl =
  process.env.AMP_PROTOCOL +
  '://' +
  process.env.AMP_USER +
  ':' +
  process.env.AMP_PASSWORD +
  '@' +
  process.env.AMP_HOST;



const gas_queue = process.env.CLOUDAMQP_GAS_QUEUE_NAME

var options = {
  durable: true,
  exclusive: false,
  autoDelete: false,
  arguments: null,
  clientId: 'ClientID',
};

export function startAmqp() {
  amqp.connect(amqpUrl, function (error0, connection) {
    if (error0) throw error0;
    createChannel(connection);
  });
}

function createChannel(amqpConn) {
  amqpConn.createChannel(function (error1, channel) {
    if (error1) throw error1;
    /** GAS queue */
    recieveData(channel, gas_queue, 'gas')
  });
}

function recieveData(amqpChannel, queue, checkQueue) {
  amqpChannel.assertQueue(queue, options);
  amqpChannel.prefetch(100);
  amqpChannel.consume(queue, function reply(msg) {
    // console.log('consume hiij bna');
    // if (checkQueue === 'device') createDevice(msg, amqpChannel)
    if (checkQueue === 'gas') insertGasLog(msg, amqpChannel);
  });
}
