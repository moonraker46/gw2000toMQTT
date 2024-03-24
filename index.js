const axios = require('axios');
const mqtt = require('mqtt');
const cron = require('node-cron');
const map = require('./mapping');
require('dotenv').config();

const protocol = 'mqtt'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `${protocol}://${process.env.MOSQUITTO_HOST}:${port}`
const qos = 0

const metrics = `get_livedata_info`;

const task = cron.schedule('* * * * *', () => {
  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    //manualConnect: true,
    connectTimeout: 4000,
    username: process.env.MOSQUITTO_USER,
    password: process.env.MOSQUITTO_PASSWORD,
    reconnectPeriod: 1000,
  })
  console.log(`${protocol}: Connected`)

  axios.get(`http://${process.env.ECOWITT_GW_IP}/${metrics}`)
    .then(function (response) {
      return response.data;
    })
    .then(res => {
      const jRes = JSON.parse(JSON.stringify(res));
      for (let val in jRes) {
        for (const item of jRes[val]) {
        
            const data = jRes[val]
            for (let i = 0; i < data.length; i++) {
              const id = data[i].id;
              if (map.mapTable[id]) {
                data[i].id = map.mapTable[id][1]; 
              }
            }
        }
        client.publish(`ecowitt/${val}`, JSON.stringify(jRes[val]), { qos });
      }
    })
    .then(() => {
      client.end()
      console.log(`${protocol}: Disconnected`)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}, {
  scheduled: false
});

task.start();