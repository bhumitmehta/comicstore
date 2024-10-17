/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('comic_genre', function (table) {
        table.integer('comic_id').unsigned().notNullable();
        table.foreign('comic_id').references('comics.id').onDelete('CASCADE');

        table.integer('genre_id').unsigned().notNullable();
        table.foreign('genre_id').references('genres.id').onDelete('CASCADE');

        table.primary(['comic_id', 'genre_id']); // Composite primary key
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('comic_genre');
};
