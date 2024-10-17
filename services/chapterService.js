const Chapter = require('../models/chapterModel'); // Adjust the path as necessary
const Comic = require('../models/comicModel'); // Adjust the path as necessary
const db = require('../database/db'); // Database connection

// Add a new chapter with transaction
exports.addChapter = async (chapterData) => {
    const { chapterTitle, comic_id, comicName, chapterNumber, availableCopies } = chapterData;

    if (!chapterTitle || (!comic_id && !comicName)) {
        throw new Error('Chapter title and either comic ID or comic name are required');
    }
    if (chapterNumber < 0) {
        throw new Error('Chapter number cannot be negative');
    }
    if (availableCopies < 0) {
        throw new Error('Available copies cannot be negative');
    }

    const trx = await db.transaction(); // Start a transaction

    try {
        let comic;

        // Check if comic_id is provided
        if (comic_id) {
            comic = await db('comics').where('id', comic_id).first();
            if (!comic) {
                throw new Error(`Comic with ID "${comic_id}" does not exist.`);
            }
        } else if (comicName) {
            comic = await db('comics').where('comicName', comicName).first();
            if (!comic) {
                throw new Error(`Comic with name "${comicName}" does not exist.`);
            }
        }

        const newChapterData = {
            comic_id: comic.id, // Use the resolved comic ID
            chapterTitle,
            chapterNumber,
            pages: chapterData.pages,
            releaseDate: chapterData.releaseDate,
            description: chapterData.description,
            availableCopies,
            chapterCondition: chapterData.chapterCondition,
            price: chapterData.price,
            discount: chapterData.discount,
        };

        // Add chapter
        const newChapter = await Chapter.create(newChapterData, { transaction: trx });

        // Increment the number of chapters in the comic table
        await Comic.incrementChapters(comic.id, trx);

        // Commit if everything is successful
        await trx.commit();

        return {
            success: true,
            message: 'Chapter added successfully!',
            chapter: newChapter
        };
    } catch (error) {
        await trx.rollback();
        throw new Error(`Failed to add chapter: ${error.message}`);
    }
};



// Update an existing chapter
exports.updateChapter = async (id, chapterData) => {
    // Input validation logic

    if (!id) {
        throw new Error(' chapter ID is required');
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
exports.getAllChapters = async (filters = {},options={}) => {
    return await Chapter.findAll({filters,...options});
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
    
    console.log("here")
    console.log(chapter,id,chapter.comic_id)
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

        return {
            success: true,
            message: 'Chapter deleted',
        };
    } catch (error) {
        // Rollback the transaction on error
        await trx.rollback();
        throw new Error(`Failed to delete chapter: ${error.message}`);
    }
};
