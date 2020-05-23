const http = require('http');
const app = require('./src');
const config = require('./config');

const { port } = config.server;
const db = require('./src/models/index');

db.sequelize.sync();

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
