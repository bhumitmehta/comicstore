const Comic = require('../models/comicModel'); // Adjust the path as necessary
const db = require('../database/db'); // Database connection

// Add a new comic book
exports.addComic = async (comicData) => {
    return await Comic.create(comicData);
};

// Get all comic books with optional filtering
exports.getAllComics = async (filters) => {
    return await Comic.findAll(filters);
};

// Get a comic book by ID
exports.getComicById = async (id) => {
    return await Comic.findById(id);
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

    // If comic doesn't exist, throw an error
    if (!existingComic) {
        throw new Error('Comic not found');
    }

    // Optional: Implement any additional checks before deleting, such as checking if chapters exist
    // For example, you could prevent deletion if there are chapters associated
    if (existingComic.numberOfChapters > 0) {
        throw new Error('Cannot delete comic with existing chapters');
    }

    // Proceed to delete the comic
    return await Comic.delete(id);
};
