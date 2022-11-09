// @ts-check

export const up = (knex) =>
  knex.schema.createTable('calendar_events', (table) => {
    table.string('id').primary().notNullable();
    table.string('user_id').unsigned().index().references('users.id');
    table.string('calendar_id').unsigned().index().references('calendars.id');
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('color').notNullable();
    // table.
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('users');
