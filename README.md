# gw2000toMQTT
Leightwight Node.js application to get the values from an Ecowitt GW 2000 (any other Ecowitt gateway like GW1000, GW1100 should work accordingly) gateway and push them to a MQTT server. The application is running as cron job every minute so after deoloying the application you can just relax and work with the published MQTT data.

## Usage
### Settings
You only have to adjust your Ecowitt Gateway IP and the MQTT settings. Either in the .env file if used standalone or in the Dockerfile if used as Docker container.

### Docker
The easy way is to use it as Docker image. Related Dockerfile is within the repo.

### Linux Service
Another way if you prefer it to run on an existing Linux server is to create a small service which exexutes the "node index.js" command at startup of the system. Everything else will be done by the application.

