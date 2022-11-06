import client from './db.js';
import  Express  from "express";

import authRouter from './routes/auth-router.js';
import userRouter from './routes/user-router.js';
import postRouter from './routes/post-router.js';
import CommRouter from './routes/comment-router.js';
import categorRouter from './routes/categories-router.js';
import cors from "cors"

import exceptionHandler from './exceptions/exception-handler.js';

import bodyParser from "body-parser";
import dotenv from "dotenv"

await client.connect();
dotenv.config();
const app = Express();
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use('/api/auth', authRouter );
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', CommRouter);
app.use('/api/categories', categorRouter);
// app.use('/api/users', userApiRouter)
// app.use('/api/post', postApiRout)
app.use(exceptionHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log("Server don start for port: " + PORT))