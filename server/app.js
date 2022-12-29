// lowi3-mqtt-web-front-end/server/app.js
const WebSocket = require('ws');
const uuid = require('uuid');
const mqtt = require('mqtt');

const wss = new WebSocket.Server({ port: 8080 });

const client  = mqtt.connect('mqtt://192.168.1.39');

console.log('[INFO] Hello! (1)');

client.on('connect', function () {
  client.subscribe('3494546c727e/PUB/CH0', function (err) {
    if (!err) {
      client.publish('3494546c727e/PUB/CH0', 'Connected with MQTT.')
      console.log('[INFO] Connected with MQTT.');
    }
  })
});

wss.on('connection', function connection(ws) {
  ws.id = uuid.v4();
  ws.on('message', function incoming(messageWS) {
    console.log(`[INFO] Received form WS: ${messageWS}`);
  });

  client.on('message', function (topic, payloadMQTT) {
    const now = new Date()
    try {
      const messageMQTT = JSON.parse(payloadMQTT.toString())
      console.log(`[INFO] Received form MQTT (if JSON): ${JSON.stringify(messageMQTT)}`)
      const messageWS = {
        power: `${messageMQTT.PI}`,
        datetime: `${now.toJSON()}`
      };
      console.log(`[INFO] Sending message to WS: ${JSON.stringify(messageWS)}`);
      wss.clients.forEach(function(client) {
        console.log(`  to: ${client.id}`);
        client.send(JSON.stringify(messageWS));
      });
    } catch(e) {
      console.log(`[INFO] Received form MQTT (if not JSON): ${payloadMQTT.toString()}`)
    }
  })

});
