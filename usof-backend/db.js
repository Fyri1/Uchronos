import pg from "pg"
import * as dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})


export default client;
