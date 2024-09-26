## To generate password

node .\src\utils\commandLine\passwordGeneration.js password=Admin321

## Dev Server Commands

- To check List: pm2 list
- Goto API code directory(where server.js can be found) and run
  NODE_ENV=development pm2 start ./server.js --name Laundry-API
- Check Logs pm2 logs or pm2 logs process-name(Laundry-API) or id(number)

## To run Docker containers (Mostly a single instance is used for multiple projects)

- Redis: docker run --name local-redis -d -p 6379:6379 redis

- RabbitMQ: docker run -d -p 5672:5672 -p 15672:15672 --name rabbitmq-server rabbitmq:management
  - Default Username: guest, Password: guest
