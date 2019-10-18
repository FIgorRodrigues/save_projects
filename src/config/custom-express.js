const express = require('express');
const app = express();
const routers = express.Router();

//Logs
let countLogs = 0;

const createLog = (req, res, next) => {
  countLogs += 1;
  console.log(`Número de requisições: ${countLogs}`);
  return next();
}

app.use(express.json());
app.use(createLog);

//Routers
app.use('/projects', require('../routers/routers-products')(routers));

module.exports = app;