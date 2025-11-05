import knex from 'lib/knex/connector';
import ApiHelpers from '../lib/ApiHelpers';

let tableName = process.env.TABLE_NAME;

let deviceTableName = process.env.DEVICE_TABLE_NAME;

const helper = new ApiHelpers(knex, tableName);

function deviceData(msg) {
  let device_data = {};
  let data = msg.content.toString();
  /** String ugugdliig - temdegeer tasdaj string array butsaana */
  let stringArray = data.split('-', 3);
  device_data.code = stringArray[1];
  device_data.name = 'Төхөөрөмж - ' + stringArray[1];
  return device_data;
}

/** Carbon data ugugduliig hurwuuleh */
function buildGasJsonData(msg, amqpChannel) {
  let sensorStringData = msg.content.toString();
  let sensorData = '';

  try {
    sensorData = JSON.parse(sensorStringData);
  } catch (e) {
    return;
  }

  if (typeof sensorData === 'object') {
    let hexString = '';
    let value = '';
    let battery_value = '';

    /** base64 -> hexCode -> decimal */
    if (sensorData.data) {
      let bufferString = Buffer.from(sensorData.data, 'base64');
      hexString = bufferString.toString('hex');
      battery_value = parseInt(hexString.slice(0, 4), 16) || 0;
      value = parseInt(hexString.slice(4), 16) || 0;
    } else return;

    return {
      device_code: sensorData.deviceName, // devEUI
      sensor_value: value,
      sensor_battery: battery_value,
    };
  } else return;
}


export function insertGasLog(msg, amqpChannel) {
  let sensor_data = buildGasJsonData(msg);
  if (typeof sensor_data === 'object')
    helper.insert(sensor_data, tableName, 'status', amqpChannel, msg);
  else amqpChannel.ack(msg); /** Object bish baiwal shuud tsewerlene */
}

export async function insertDevice(msg, queue, amqpChannel) {
  let device_data = deviceData(msg);
  if (device_data.code) {
    let result = await helper.findOne(device_data.code, deviceTableName);
    if (!result.length) {
      helper.insert(device_data, deviceTableName, 'status', amqpChannel, msg);
    } else {
      /** device code umnu ni nemegdsen bwal ack hiij tsewerlene*/
      amqpChannel.ack(msg);
    }
  } else {
    /** device code hooson irsen ved data-g ack hiij shuud tsewerlene */
    amqpChannel.ack(msg);
  }
}
