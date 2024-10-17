const Comic = require('../models/comicModel'); // Adjust the path as necessary
 // Database connection

// Add a new comic book
exports.addComic = async (comicData) => {
    try {
        const result = await Comic.create(comicData);
        // Check if the result indicates success (you can adjust this based on how your DB driver returns results)
        if (result) {
            return { 
                success: true, 
                message: 'Comic added successfully!', 
            };
        } else {
            return { 
                success: false, 
                message: 'Failed to add comic.' 
            };
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const duplicateField = error.sqlMessage.match(/for key '(.+?)'/)[1];  // Extracts the unique key causing the conflict
            return { 
                success: false, 
                message: `Comic with the same comic name already exists. Please use a different name or do u what to add a chapter.` 
            };
        }
        console.error('Error adding comic:', error);
        return { 
            success: false, 
            message: 'An error occurred while adding the comic.', 
            error: error.message 
        };
    }
};

// Get all comic books with optional filtering
// Get all comic books with optional filtering
exports.getAllComics = async (filters) => {
    try {
        console.log(filters)
        const comics = await Comic.findAll(filters);

        if (comics && comics.length > 0) {
            return { 
                success: true, 
                message: 'Comics retrieved successfully!', 
                data: comics 
            };
        } else {
            return { 
                success: false, 
                message: 'No comics found.' 
            };
        }
    } catch (error) {
        console.error('Error fetching comics:', error);
        return { 
            success: false, 
            message: 'An error occurred while retrieving the comics.', 
            error: error.message 
        };
    }
};

// Get a comic book by ID
exports.getComicById = async (id) => {
    try {
        const comic = await Comic.findById(id);

        if (comic) {
            return { 
                success: true, 
                message: 'Comic retrieved successfully!', 
                data: comic 
            };
        } else {
            return { 
                success: false, 
                message: 'Comic not found.' 
            };
        }
    } catch (error) {
        console.error('Error fetching comic by ID:', error);
        return { 
            success: false, 
            message: 'An error occurred while retrieving the comic by ID.', 
            error: error.message 
        };
    }
};


// Update a comic
exports.updateComic = async (id, comicData) => {
    // Fetch the current comic details
    const existingComic = await Comic.findById(id);

    // If comic doesn't exist, throw an error
    if (!existingComic) {
        throw new Error('Comic not found');
    }

    // Logic to handle number of chapters if updating the comic
    const currentChapters = existingComic.numberOfChapters;

    // If the chapter count is modified in the update, you might want to enforce business rules
    if (comicData.numberOfChapters !== undefined) {
        const newChapters = comicData.numberOfChapters;
        
        // Example: ensure the new chapter count is not less than current chapters
        if (newChapters < currentChapters) {
            throw new Error('New number of chapters cannot be less than existing chapters');
        }
    }

    // Proceed to update the comic
    return await Comic.update(id, comicData);
};

// Delete a comic book
exports.deleteComic = async (id) => {
    // Fetch the current comic details
    const existingComic = await Comic.findById(id);
    console.log(existingComic)
    // If comic doesn't exist, throw an error
    if (!existingComic) {
        throw new Error('Comic not found');
    }

    
    if (existingComic.numberOfChapters > 0) {
        throw new Error('Cannot delete comic with existing chapters');
    }
    // Proceed to delete the comic
    return await Comic.delete(id);
};
