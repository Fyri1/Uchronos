// @ts-check

export const up = (knex) =>
  knex.schema.createTable('users', (table) => {
    table.string('id').primary().notNullable();
    table.string('login').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('link_event');
    table.boolean('active').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('users');
