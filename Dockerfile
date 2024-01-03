FROM denoland/deno:latest

EXPOSE 7777

WORKDIR /app

USER deno

COPY . .

RUN deno cache app.js

CMD ["run", "--allow-net", "--allow-read", "--allow-env", "app.js"]
