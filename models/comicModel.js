const db = require('../database/db'); // Import the Knex instance

// Comic model
const Comic = {
    // Create a new comic
    create: async (comicData) => {
        console.log(comicData)
        const {
            comicName,
            authorName,
            yearOfPublication,
            noOfChapters,
            description
        } = comicData;

        const sql = `
            INSERT INTO comics (comicName, authorName, yearOfPublication , noOfChapters, description) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [comicName, authorName, yearOfPublication , noOfChapters, description];

        const result = await db.raw(sql, values); 
        console.log(result)// Use Knex's raw query method
        return result;
    },

    // Find all comics with optional filters
    // Find all comics with optional filters and sorting
    findAll: async (filters = {}) => {
        let { authorName, yearOfPublication, comicName } = filters.where || {};
        const { limit = 10, offset = 0, order = [] } = filters;
    
        // Logging the filters for debugging
        console.log('Filters:', filters);
    
        // Trim and remove extra quotes from authorName and comicName
        if (authorName) {
            authorName = authorName.replace(/^["']|["']$/g, ''); // Remove leading/trailing quotes
        }
        if (comicName) {
            comicName = comicName.replace(/^["']|["']$/g, ''); // Remove leading/trailing quotes
        }
    
        let sql = 'SELECT id, comicName, authorName, yearOfPublication, noOfChapters FROM comics'; // Exclude details column
        const conditions = [];
        const values = [];
    
        // Add conditions for filtering
        if (authorName) {
            conditions.push('authorName LIKE ?');
            values.push(`%${authorName}%`);
        }
        if (yearOfPublication) {
            conditions.push('yearOfPublication = ?');
            values.push(yearOfPublication);
        }
        if (comicName) {
            conditions.push('comicName = ?');
            values.push(comicName);
        }
    
        // If there are conditions, append them to the SQL query
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }
    
        // Add sorting if specified
        if (order.length > 0) {
            let [sortBy, sortOrder] = order[0]; // Extract sorting column and order
            sortBy = sortBy.replace(/^["']|["']$/g, ''); // Remove any extra quotes
            const validColumns = ['comicName', 'authorName', 'yearOfPublication', 'noOfChapters']; // Example of valid columns
            if (validColumns.includes(sortBy)) {
                sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`; // Include sorting direction
            } else {
                throw new Error('Invalid column for sorting');
            }
        }
    
        // Add pagination (LIMIT and OFFSET)
        sql += ` LIMIT ? OFFSET ?`;
        values.push(limit, offset);
    
        console.log('SQL Query:', sql);
        console.log('Values:', values);
    
        const results = await db.raw(sql, values);
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
        console.log(id, comicData);
    
        // Start with the base query
        let sql = 'UPDATE comics SET ';
        const updates = [];
        const values = [];
    
        // Check for each property in comicData
        if (comicData.comicName !== undefined) {
            updates.push('comicName = ?');
            values.push(comicData.comicName);
        }
        if (comicData.authorName !== undefined) {
            updates.push('authorName = ?');
            values.push(comicData.authorName);
        }
        if (comicData.yearOfPublication !== undefined) {
            updates.push('yearOfPublication = ?');
            values.push(comicData.yearOfPublication);
        }
        if (comicData.noOfChapters !== undefined) {
            updates.push('noOfChapters = ?');
            values.push(comicData.noOfChapters);
        }
        if (comicData.description !== undefined) {
            updates.push('description = ?');
            values.push(comicData.description);
        }
    
        // If no updates were found, throw an error
        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }
    
        // Join updates and add the WHERE clause
        sql += updates.join(', ') + ' WHERE id = ?';
        values.push(id); // Add the ID at the end for the WHERE clause
    
        // Log the query and values
        console.log('Executing SQL:', sql);
        console.log('With Values:', values);
    
        // Execute the query
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
      const sql = 'UPDATE comics SET noOfChapters = noOfChapters + 1 WHERE id = ?';
      const result = trx
          ? await trx.raw(sql, [comicId]) // Use transaction if provided
          : await db.raw(sql, [comicId]); // Use the default db connection if no transaction
      return result;
  },

  decrementChapters: async (comicId, trx) => {
    if (!comicId) {
        throw new Error('Comic ID is required');
    }

    // Raw SQL query to decrement the number of chapters
    const query = 'UPDATE comics SET noOfChapters = noOfChapters - 1 WHERE id = ?';
    const values = [comicId];

    return await trx.raw(query, values); // Use transaction to execute the query
},

  count: async (filters = {}) => {
    const { authorName, yearOfPublication } = filters;
    let sql = 'SELECT COUNT(*) AS totalCount FROM comics';
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

    const result = await db.raw(sql, values);
    return result[0][0].totalCount; // Return the total count from the result
}
};

module.exports = Comic;
