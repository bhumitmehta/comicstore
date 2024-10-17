const db = require('../database/db');
const { findById } = require('./comicModel');

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
            chapterCondition,
            price,
            discount,
        } = chapterData;

        const query = `
            INSERT INTO chapters (comic_id, chapterTitle, chapterNumber, pages, description, availableCopies, releaseDate, chapterCondition, price, discount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [comic_id, chapterTitle, chapterNumber, pages, description, availableCopies, releaseDate, chapterCondition, price, discount];
        const result = await db.raw(query, values);
        return result; // Return the result
    },

    // Update an existing chapter
    update: async (id, chapterData) => {
        // Validate that the chapter exists
        const chapter = await Chapter.findById(id);
        if (!chapter) {
            throw new Error('Chapter not found');
        }
    
        // Prepare the fields to update
        const fields = [];
        const values = [];
    
        // Check for each property and add it to the fields and values if present
        if (chapterData.comic_id !== undefined) {
            fields.push('comic_id = ?');
            values.push(chapterData.comic_id);
        }
        if (chapterData.chapterTitle !== undefined) {
            fields.push('chapterTitle = ?');
            values.push(chapterData.chapterTitle);
        }
        if (chapterData.chapterNumber !== undefined) {
            fields.push('chapterNumber = ?');
            values.push(chapterData.chapterNumber);
        }
        if (chapterData.pages !== undefined) {
            fields.push('pages = ?');
            values.push(chapterData.pages);
        }
        if (chapterData.description !== undefined) {
            fields.push('description = ?');
            values.push(chapterData.description);
        }
        if (chapterData.availableCopies !== undefined) {
            fields.push('availableCopies = ?');
            values.push(chapterData.availableCopies);
        }
        if (chapterData.releaseDate !== undefined) {
            fields.push('releaseDate = ?');
            values.push(chapterData.releaseDate);
        }
    
        // If no fields are provided, throw an error
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
    
        // Construct the final query
        const query = `
            UPDATE chapters SET ${fields.join(', ')}
            WHERE id = ?
        `;
        
        // Add the chapter ID to the end of the values array
        values.push(id);
    
        // Execute the query
        const result = await db.raw(query, values);
        return result; // Return the result
    },
    
    // Find a chapter by ID
    find: async (id) => {
        const query = 'SELECT * FROM chapters WHERE id = ?';
        const result = await db.raw(query, [id]);
        return result[0][0]; // Return the first row
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
        return result; // Return the result
    },

    findAll: async (options = {}) => {
        const { filters = {}, limit, offset, sortBy = 'releaseDate', order = 'ASC'} = options;

        let query = 'SELECT * FROM chapters';
        const conditions = [];
        const values = [];

        // Build filter conditions
        if (filters.chapterTitle) {
            conditions.push('chapterTitle LIKE ?');
            values.push(`%${filters.chapterTitle}%`);
        }
        if (filters.releaseDate) {
            conditions.push('releaseDate = ?');
            values.push(filters.releaseDate);
        }
        if (filters.chapterNumber) {
            conditions.push('chapterNumber = ?');
            values.push(filters.chapterNumber);
        }
        if (filters.comic_id) {
            conditions.push('comic_id = ?');
            values.push(filters.comic_id);
        }
        if (filters.availableCopies) {
            conditions.push('availableCopies >= ?');
            values.push(filters.availableCopies);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Add sorting
        query += ` order by ${sortBy} ${order}`;

        // Add pagination
        if (limit) {
            query += ' LIMIT ? OFFSET ?';
            values.push(limit, offset);
        }

        const result = await db.raw(query, values);
        return result[0]; // Return the array of results
    },

    // Count all chapters for pagination
    countAll: async (filters = {}) => {
        let query = 'select COUNT(*) AS count FROM chapters';
        const conditions = [];
        const values = [];

        if (filters.chapterTitle) {
            conditions.push('chapterTitle LIKE ?');
            values.push(`%${filters.chapterTitle}%`);
        }
        if (filters.releaseDate) {
            conditions.push('releaseDate = ?');
            values.push(filters.releaseDate);
        }
        if (filters.chapterNumber) {
            conditions.push('chapterNumber = ?');
            values.push(filters.chapterNumber);
        }
        if (filters.comic_id) {
            conditions.push('comic_id = ?');
            values.push(filters.comic_id);
        }
        if (filters.availableCopies) {
            conditions.push('availableCopies >= ?');
            values.push(filters.availableCopies);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const result = await db.raw(query, values);
        return result[0].count; // Return count
    },
    findById: async(chapter_id)=>{
        const query = "select * from chapters where id =?"
        const value  = chapter_id 
        const result = await db.raw(query,value);
        console.log(result)
        return result[0][0]
    }
};

module.exports = Chapter;
