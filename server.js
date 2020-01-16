const express = require('express');
const server = express();
const helmet = require('helmet');

const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

server.use(helmet());
server.use(express.json());
server.use(logger);
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(` [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next();
}

module.exports = server;