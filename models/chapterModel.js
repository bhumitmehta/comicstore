const db = require('../database/db');

const Chapter = {
    // Create a new chapter
    create: async (chapterData) => {
        const {
            comic_id,
            chapterTitle,
            chapterNumber,
            pages,
            description,
            availableCopies,
            releaseDate,
        } = chapterData;

        const query = `
            INSERT INTO chapters (comic_id, chapterTitle, chapterNumber, pages, description, availableCopies, releaseDate)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [comic_id, chapterTitle, chapterNumber, pages, description, availableCopies, releaseDate];
        const result = await db.raw(query, values);
        return result; // Return the result
    },

    // Update an existing chapter
    update: async (id, chapterData) => {
        const {
            comic_id,
            chapterTitle,
            chapterNumber,
            pages,
            description,
            availableCopies,
            releaseDate,
        } = chapterData;

        const query = `
            UPDATE chapters SET comic_id = ?, chapterTitle = ?, chapterNumber = ?, pages = ?, description = ?, availableCopies = ?, releaseDate = ?
            WHERE id = ?
        `;
        const values = [comic_id, chapterTitle, chapterNumber, pages, description, availableCopies, releaseDate, id];
        const result = await db.raw(query, values);
        return result; // Return the result
    },

    // Find all chapters with optional filters
    findAll: async (filters = {}) => {
        const { chapterTitle, releaseDate, chapterNumber, comic_id, availableCopies } = filters;

        let query = 'SELECT * FROM chapters';
        const conditions = [];
        const values = [];

        if (chapterTitle) {
            conditions.push('chapterTitle LIKE ?');
            values.push(`%${chapterTitle}%`);
        }
        if (releaseDate) {
            conditions.push('releaseDate = ?');
            values.push(releaseDate);
        }
        if (chapterNumber) {
            conditions.push('chapterNumber = ?');
            values.push(chapterNumber);
        }
        if (comic_id) {
            conditions.push('comic_id = ?');
            values.push(comic_id);
        }
        if (availableCopies) {
            conditions.push('availableCopies >= ?');
            values.push(availableCopies);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const result = await db.raw(query, values);
        return result[0]; // Return the array of results
    },

    find : async(id)=>{
        const query = 'select * from chpaters where id = ?'
        const result = await db.raw(query,[id])
        return result
    },

    // Delete a chapter by ID with optional transaction
    delete: async (id, trx) => {
        const query = 'DELETE FROM chapters WHERE id = ?';
        const result = trx 
            ? await trx.raw(query, [id]) // Use transaction if provided
            : await db.raw(query, [id]); // Use the default db connection if no transaction
        return result; // Return the result
    },

    // Delete chapters by comic ID
    deleteByComicId: async (comic_id) => {
        const query = 'DELETE FROM chapters WHERE comic_id = ?';
        const result = await db.raw(query, [comic_id]);
        return result;
    },
};

module.exports = Chapter;
