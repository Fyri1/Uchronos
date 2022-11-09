// @ts-check

export const up = (knex) =>
  knex.schema.createTable('calendar_friends', (table) => {
    table.string('user_id').unsigned().index().references('users.id');
    table.string('calendar_id').unsigned().index().references('calendars.id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('users');
