/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('comics', function(table) {
      table.unique('comicName'); // Adding a unique constraint to comicName
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.alterTable('comics', function(table) {
      table.dropUnique('comicName'); // Dropping the unique constraint in case of rollback
    });
  };
  