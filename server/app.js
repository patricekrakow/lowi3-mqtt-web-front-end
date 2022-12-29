// lowi3-mqtt-web-front-end/server/app.js
const WebSocket = require('ws');
const uuid = require('uuid');
const mqtt = require('mqtt');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 8080 });

const client  = mqtt.connect('mqtt://192.168.1.39');

console.log(`[INFO] Hello! (2)`);
console.log(`[INFO] __dirname: ${__dirname}`);
console.log(`[INFO] process.cwd(): ${process.cwd()}`);

client.on('connect', function () {
  client.subscribe('3494546c727e/PUB/CH0', function (err) {
    if (!err) {
      client.publish('3494546c727e/PUB/CH0', 'Connected with MQTT.')
      console.log('[INFO] Connected with MQTT.');
    }
  })
});

client.on('message', function (topic, payloadMQTT) {
  const now = new Date();
  const fileName = now.toISOString().split('T')[0];
  try {
    // Getting message from MQTT:
    const messageMQTT = JSON.parse(payloadMQTT.toString());
    console.log(`[INFO][MQTT] Received (if JSON): ${JSON.stringify(messageMQTT)}`);
    // Transform message for CSV file:
    const keys = Object.keys(messageMQTT);
    let content = `${now.toJSON()},`;
    for (let i = 0; i < keys.length - 1; i++) {
      content += `${messageMQTT[keys[i]]},`
    }
    content += `${messageMQTT[keys[keys.length - 1]]}\n`
    fs.writeFile(`${__dirname}/${fileName}.csv`, content, { flag: 'a' }, err => {
      if (err) {
        console.log(`[ERROR] Cannot write to file "${__dirname}/${fileName}.csv" | ${err}`)
      }
    });
    console.log(`[INFO][ CSV] ${now.toJSON()}|${messageMQTT.PI} W|${messageMQTT.CIH} Wh|${messageMQTT.CIL} Wh`);
    // Transform message for WS:
    const messageWS = {
      power: `${messageMQTT.PI}`,
      datetime: `${now.toJSON()}`
    };
    console.log(`[INFO][  WS] message: ${JSON.stringify(messageWS)}`);
    wss.clients.forEach(function(client) {
      console.log(`[INFO][  WS]   sending to: ${client.id}`);
      client.send(JSON.stringify(messageWS));
    });
  } catch(e) {
    console.log(`[INFO][MQTT] Received (if not JSON): ${payloadMQTT.toString()}`)
  }
});

wss.on('connection', function connection(ws) {
  ws.id = uuid.v4();
  ws.on('message', function incoming(messageWS) {
    console.log(`[INFO][  WS] Received form WS: ${messageWS}`);
  });
});
