// controllers/listingController.js

const listingService = require('../services/listingService');

const getComicBooks = async (req, res) => {
    try {
        // Get query parameters for pagination, filtering, sorting
        const { 
            page = 1, 
            limit = 10, 
            authorName, 
            yearOfPublication, 
            comicName, 
            sortBy = 'comicName', 
            sortOrder = 'ASC' 
        } = req.query;

        // Prepare filters object
        const filters = {};
        if (authorName) filters.authorName = authorName;
        if (yearOfPublication) filters.yearOfPublication = yearOfPublication;
        if (comicName) filters.comicName = comicName;

        // Prepare options object
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: sortBy,
            sortOrder: sortOrder,
        };
        console.log("here",options)
        // Fetch comic books from the service
        const result = await listingService.getComics(filters, options);

        // Send the result as a response
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getChapters = async (req, res) => {
    try {
        console.log("here")
        const chapters = await listingService.getChapters(req.query);
        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getComicBooks,
    getChapters,
};
