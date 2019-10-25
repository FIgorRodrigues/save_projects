const express = require('express');

class CustomExpress{

  constructor(){
    this.app = express();
    this.countLogs = 0;
    this.middlewares();
  }

  middlewares(){
    this.app.use(express.json());
    this.app.use(this.createLog.bind(this));
    this.app.use(
      '/projects',
      require('../routers/routers-products')
    );
  }

  createLog(req, res, next){
    this.countLogs += 1;
    console.log(`Número de requisições: ${this.countLogs}`);
    return next();
  }
}

module.exports = new CustomExpress().app;