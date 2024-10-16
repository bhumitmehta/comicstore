const Chapter = require('../models/chapterModel'); // Adjust the path as necessary
const Comic = require('../models/comicModel'); // Adjust the path as necessary
const db = require('../database/db'); // Database connection

// Add a new chapter with transaction
exports.addChapter = async (chapterData) => {
    // Input validation logic
    if (!chapterData.chapterTitle || !chapterData.comic_id) {
        throw new Error('Chapter title and comic ID are required');
    }
    if (chapterData.chapterNumber < 0) {
        throw new Error('Chapter number cannot be negative');
    }
    if (chapterData.availableCopies < 0) {
        throw new Error('Available copies cannot be negative');
    }

    const trx = await db.transaction(); // Start a transaction

    try {
        // Add chapter
        const newChapter = await Chapter.create(chapterData, trx);
        
        // If added successfully, increment the number of chapters in the comic table
        await Comic.incrementChapters(chapterData.comic_id, trx);

        // Commit if everything is successful
        await trx.commit();

        return newChapter;
    } catch (error) {
        // Rollback the transaction on error
        await trx.rollback();
        throw new Error(`Failed to add chapter: ${error.message}`);
    }
};

// Update an existing chapter
exports.updateChapter = async (id, chapterData) => {
    // Input validation logic
    if (!chapterData.chapterTitle || !chapterData.comic_id) {
        throw new Error('Chapter title and comic ID are required');
    }
    if (chapterData.chapterNumber < 0) {
        throw new Error('Chapter number cannot be negative');
    }
    if (chapterData.availableCopies < 0) {
        throw new Error('Available copies cannot be negative');
    }

    return await Chapter.update(id, chapterData);
};

// Get all chapters with optional filtering
exports.getAllChapters = async (filters = {}) => {
    return await Chapter.findAll(filters);
};

// Get a chapter by ID
exports.getChapterById = async (id) => {
    const chapter = await Chapter.find(id);
    if (!chapter) {
        throw new Error('Chapter not found');
    }
    return chapter;
};

// Delete a chapter
exports.deleteChapter = async (id) => {
    // Check if the chapter exists before deleting
    const chapter = await Chapter.findById(id);
    if (!chapter) {
        throw new Error('Chapter not found');
    }
    
    const trx = await db.transaction(); // Start a transaction

    try {
        // Delete chapter
        await Chapter.delete(id, trx);
        
        // Decrement the number of chapters in the comic table
        await Comic.decrementChapters(chapter.comic_id, trx);

        // Commit if everything is successful
        await trx.commit();

        return "Chapter deleted successfully";
    } catch (error) {
        // Rollback the transaction on error
        await trx.rollback();
        throw new Error(`Failed to delete chapter: ${error.message}`);
    }
};
