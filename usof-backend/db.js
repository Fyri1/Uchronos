import pg from "pg"

const client = new pg.Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})


export default client;
