# Web Front End for LoWi3 using MQTT 

## Prerequisites

<https://github.com/patricekrakow/play-with-raspberry-pi>

## Install

```text
ssh pi@raspberrypi
```

```text
pwd
```

```text
mkdir -p /home/pi/lowi3/server
```

```text
mkdir -p /home/pi/lowi3/www
```

```text
exit
```

```text
scp ~/work/lowi3-mqtt-web-front-end/server/app.js pi@raspberrypi:/home/pi/lowi3/server
```

```text
scp ~/work/lowi3-mqtt-web-front-end/server/package.json pi@raspberrypi:/home/pi/lowi3/server
```

```text
scp ~/work/lowi3-mqtt-web-front-end/server/package-lock.json pi@raspberrypi:/home/pi/lowi3/server
```

```text
scp ~/work/lowi3-mqtt-web-front-end/www/index.html pi@raspberrypi:/home/pi/lowi3/www
```

```text
ssh pi@raspberrypi
```

```text
which npm
```

```text
sudo ln -s /usr/local/lib/nodejs/node-v18.12.1-linux-armv7l/bin/npm /usr/bin/npm
```

```text
which node
```

```text
sudo ln -s /usr/local/lib/nodejs/node-v18.12.1-linux-armv7l/bin/node /usr/bin/node
```

```text
sudo npm install -g http-server
```

```text
sudo npm install -g npm@9.2.0
```

```text
which http-server
```

```text
sudo ln -s /usr/local/lib/nodejs/node-v18.12.1-linux-armv7l/bin/http-server /usr/bin/http-server
```

```text
http-server /home/pi/lowi3/www --port 8082
```

```text
sudo npm install -g pm2
```

```text
which pm2
```

```text
sudo ln -s /usr/local/lib/nodejs/node-v18.12.1-linux-armv7l/bin/pm2 /usr/bin/pm2
```

```text
/usr/bin/http-server /home/pi/lowi3/www -p 8082 -d false
```

```text
pm2 start /usr/bin/http-server --name lowi3-www -- /home/pi/lowi3/www -p 8082 -d false
```

```text
pm2 save
```

```text
cd lowi3/server/
```

```text
npm install
```

```text
node app.js
```

```text
pm2 start /home/pi/lowi3/server/app.js --name lowi3-server
```

```text
pm2 save
```

```text
pm2 startup -u pi
```
