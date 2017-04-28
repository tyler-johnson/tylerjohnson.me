FROM mhart/alpine-node:latest

RUN npm i @mrgalaxy/tjme -g

ENV PORT=8080
EXPOSE $PORT

VOLUME ["/etc/tjme"]
ENTRYPOINT [ "tjme", "--host", "0.0.0.0" ]
