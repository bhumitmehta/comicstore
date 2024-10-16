/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('comics').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('comics', function (table) {
          table.increments('id').primary();
          table.string('bookName', 255).notNullable();
          table.string('authorName', 255).notNullable();
          table.integer('yearOfPublication').notNullable();
          table.integer('noOfChapters').defaultTo(0)
          table.integer('numberOfPages').notNullable();
          table.text('description');
        });
      }
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('comics');
  };
