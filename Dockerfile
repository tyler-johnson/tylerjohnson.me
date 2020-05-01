FROM node:lts-slim

WORKDIR /app
COPY . /app/

RUN useradd -r -m pduser && \
  chown -R pduser:pduser /app

USER pduser
RUN yarn

ENV PORT=8080
EXPOSE $PORT

CMD ["node","bin/cli.js","--host","0.0.0.0"]
