import Express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import bodyParser from 'body-parser';
import router from './router/router.js';
import errorMiddleware from './middlewares/error-middleware.js';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

export default () => {
  dotenv.config();
  const app = new Express({ logger: true });
  const createSocketServer = http.Server(app);
  const io = new Server(createSocketServer, {
    cors: {
      origin: 'http://127.0.0.1:5173',
      // origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(socket.id);
  });

  const socketMiddleware = (req, res, next) => {
    req.io = io;
    next();
  };

  app.get('/', (req, res) => {});
  app.use(cookieParser());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/avatars', Express.static(`${path.resolve()}/avatars`));
  app.use('/picture-post', Express.static(`${path.resolve()}/picture-post`));
  app.use('/api', socketMiddleware, router);
  app.use(errorMiddleware);
  return createSocketServer;
};
