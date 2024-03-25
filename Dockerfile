FROM node:16.13-alpine3.15
RUN apk update && apk add git 
RUN git config --global http.sslVerify false

WORKDIR /app
RUN cd /app
RUN git clone https://github.com/moonraker46/gw2000toMQTT.git

WORKDIR /app/gw2000toMQTT
RUN cd /app/gw2000toMQTT

# Input your Gateway IP
RUN sed "s/# ECOWITT_GW_IP='192.168.10.228'/ECOWITT_GW_IP='192.168.10.228'/" ./.env
# Input your MQTT host or IP
RUN sed "s/# MOSQUITTO_HOST='192.168.10.4'/MOSQUITTO_HOST='192.168.10.4'/" ./.env
# Input your MQTT username
RUN sed "s/# MOSQUITTO_USER='youruser'/MOSQUITTO_USER='mqttusername'/" ./.env 
# Input your MQTT password
RUN sed "s/# MOSQUITTO_PASSWORD='yourpassword'/MOSQUITTO_PASSWORDs='mqttpassword'/" ./.env 

RUN apk --no-cache add --virtual .builds-deps build-base python3
RUN npm install

CMD ["node", "/app/gw2000toMQTT/index.js"] 
