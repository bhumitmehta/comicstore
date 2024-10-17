// services/listingService.js

const Comic = require('../models/comicModel'); 
const Chapter = require('../models/chapterModel'); 

const getComics = async (filters, options) => {
    try {
        console.log(options,"here")
        const { page = 1, limit = 10, sortBy = 'comicName', sortOrder = 'ASC' } = options;
        
        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Prepare sorting condition
        const order = [[sortBy, sortOrder.toUpperCase()]]; // Sort by provided field and order (ASC/DESC)

        // Fetch comics with filters, pagination, and sorting
        const comics = await Comic.findAll({
            where: { ...filters }, 
            limit: limit,
            offset: offset,
            order: order, // Apply sorting
        });

        // Get total count for pagination
        const totalCount = await Comic.count({ where: { ...filters } });

        return {
            totalCount: totalCount,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalCount / limit),
            data: comics,
        };
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching comic books');
    }
};


// Get all chapters with optional filters, pagination, and sorting
const getChapters = async (queryParams) => {
    const {
        page = 1, // Default to first page
        limit = 10, // Default to 10 items per page
        sortBy = 'releaseDate', // Default sort by release date
        order = 'ASC', // Default order ascending
        ...filters // Remaining query params as filters
    } = queryParams;

    // Validate pagination parameters
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (pageNumber < 1 || limitNumber < 1) {
        throw new Error('Page and limit must be greater than zero.');
    }

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * limitNumber;

    // Create filters for the query
    const chapterFilters = {
        chapterTitle: filters.chapterTitle,
        releaseDate: filters.releaseDate,
        chapterNumber: filters.chapterNumber,
        comic_id: filters.comic_id,
        availableCopies: filters.availableCopies,
    };

    // Fetch chapters from the database with pagination, filtering, and sorting
    const chapters = await Chapter.findAll({
        where: chapterFilters, // Use appropriate method for your ORM
        limit: limitNumber,
        offset: offset,
        order: [[sortBy, order]], // Sorting
    });

    // Get the total count for pagination
    const totalChapters = await Chapter.count({ where: chapterFilters });

    return {
        success: true,
        message: 'Chapters retrieved successfully!',
        data: chapters,
        pagination: {
            total: totalChapters,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(totalChapters / limitNumber),
        },
    };
};

module.exports = {
    getComics,
    getChapters,
};
