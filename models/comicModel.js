const db = require('../database/db'); // Import the Knex instance

// Comic model
const Comic = {
    // Create a new comic
    create: async (comicData) => {
        const {
            comicName,
            authorName,
            yearOfPublication,
            price,
            discount,
            numberOfChapters,
            condition,
            description,
        } = comicData;

        const sql = `
            INSERT INTO comics (comicName, authorName, yearOfPublication, price, discount, numberOfChapters, comicCondition, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [comicName, authorName, yearOfPublication, price, discount, numberOfChapters, condition, description];

        const result = await db.raw(sql, values); // Use Knex's raw query method
        return result;
    },

    // Find all comics with optional filters
    findAll: async (filters = {}) => {
        const { authorName, yearOfPublication } = filters;
        let sql = 'SELECT * FROM comics';
        const conditions = [];
        const values = [];

        if (authorName) {
            conditions.push('authorName LIKE ?');
            values.push(`%${authorName}%`);
        }
        if (yearOfPublication) {
            conditions.push('yearOfPublication = ?');
            values.push(yearOfPublication);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        const results = await db.raw(sql, values); // Execute raw SQL query with Knex
        return results[0]; // Return the query result
    },

    // Find a comic by its ID
    findById: async (id) => {
        const sql = 'SELECT * FROM comics WHERE id = ?';
        const result = await db.raw(sql, [id]);
        return result[0][0]; // Get the first row from the result
    },

    // Update a comic by ID
    update: async (id, comicData) => {
        const {
            comicName,
            authorName,
            yearOfPublication,
            price,
            discount,
            numberOfChapters,
            condition,
            description,
        } = comicData;

        const sql = `
            UPDATE comics SET comicName = ?, authorName = ?, yearOfPublication = ?, price = ?, discount = ?, numberOfChapters = ?, comicCondition = ?, description = ?
            WHERE id = ?
        `;
        const values = [comicName, authorName, yearOfPublication, price, discount, numberOfChapters, condition, description, id];

        const result = await db.raw(sql, values);
        return result;
    },

    // Delete a comic by ID with optional transaction
    delete: async (id, trx) => {
        const sql = 'DELETE FROM comics WHERE id = ?';
        const result = trx 
            ? await trx.raw(sql, [id]) // Use transaction if provided
            : await db.raw(sql, [id]); // Use the default db connection if no transaction
        return result;
    },

    incrementChapters: async (comicId, trx) => {
      const sql = 'UPDATE comics SET numberOfChapters = numberOfChapters + 1 WHERE id = ?';
      const result = trx
          ? await trx.raw(sql, [comicId]) // Use transaction if provided
          : await db.raw(sql, [comicId]); // Use the default db connection if no transaction
      return result;
  },

    decrementChapters: async (comicId, trx) => {
    const sql = 'UPDATE comics SET numberOfChapters = numberOfChapters - 1 WHERE id = ?';
    const result = trx
        ? await trx.raw(sql, [comicId]) // Use transaction if provided
        : await db.raw(sql, [comicId]); // Use the default db connection if no transaction
    return result;
  },

};

module.exports = Comic;
