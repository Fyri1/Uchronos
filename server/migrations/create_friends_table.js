// @ts-check

export const up = (knex) =>
  knex.schema.createTable('friends', (table) => {
    table.string('user_id').unsigned().index().references('users.id');
    table.string('friend_id').unsigned().index().references('users.id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('users');
