import knex from 'knex';
import * as knexConfig from './knexfile.js';

const mode = process.env.NODE_ENV || 'development';
const client = knex(knexConfig[mode]);

export default client;
