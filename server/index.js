import Express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import bodyParser from 'body-parser';
import authRouter from './router/auth-router.js';
import calendarRouter from './router/calendar-router.js';
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
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(socket.id);
  });

  const socketMiddleware = (req, _res, next) => {
    req.io = io;
    next();
  };

  app.use(cookieParser());
  app.use(
    cors({
      origin: 'http://127.0.0.1:5173',
      credentials: true,
    })
  );
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/avatars', Express.static(`${path.resolve()}/avatars`));
  app.use('/picture-post', Express.static(`${path.resolve()}/picture-post`));
  app.use('/api/auth', socketMiddleware, authRouter);
  app.use('/api/calendar', socketMiddleware, calendarRouter);
  app.use(errorMiddleware);
  return createSocketServer;
};
