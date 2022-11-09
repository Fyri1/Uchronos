// @ts-check

export const up = (knex) =>
  knex.schema.createTable('refresh_token', (table) => {
    table.string('user_id').unsigned().index().references('users.id');
    table.string('refresh_token');
  });

export const down = (knex) => knex.schema.dropTable('users');
