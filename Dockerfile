FROM node:lts-slim

WORKDIR /app
COPY . /app/

RUN useradd -r pduser && \
  chown -R pduser:pduser /app

USER pduser

RUN yarn --prod

ENV PORT=8080
EXPOSE $PORT

CMD ["node","bin/cli.js","--host","0.0.0.0"]
