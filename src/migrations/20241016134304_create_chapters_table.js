/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('chapters').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('chapters', function (table) {
          table.increments('id').primary();
          table
            .integer('comic_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('comics')
            .onDelete('CASCADE');
          table.string('chapterTitle', 255).notNullable();
          table.integer('chapterNumber').notNullable();
          table.integer('pages').notNullable();
          table.date('releaseDate');
          table.text('description');
          
          // Only define availableCopies once
          table.integer('availableCopies').defaultTo(0).notNullable();
  
          // Using raw SQL to define a check constraint
          table.check('availableCopies >= 0'); // Ensure availableCopies is non-negative
          
          table.enu('chapterCondition', ['new', 'used']).notNullable();
          table.decimal('price', 10, 2).notNullable();
          table.decimal('discount', 5, 2);
        });
      }
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('chapters');
  };
  