from digitallyseamless/nodejs-bower-grunt

copy ./ /influx-dashboard
workdir /influx-dashboard
expose 9000

cmd grunt serve

