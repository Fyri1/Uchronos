import Express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from "cors";
import path from "path";

// Set environmental variables
import * as dotenv from 'dotenv';
dotenv.config();

// Set DB connection
import client from './db.js';
await client.connect();

// Import routers
import authRouter from "./routes/auth-router.js";
import userRouter from "./routes/user-router.js";


const app = Express();

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/avatars', Express.static(`${path.resolve()}/user-avatars`));


// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


app.listen(process.env.CLIENT_PORT, () => {
    console.log("Client server started at " + process.env.CLIENT_PORT);
});
