const ComicService = require('../services/comicService');
const ChapterService = require('../services/chapterService');

// Controller to get comic details along with its chapters
const getComicDetailsWithChapters = async (req, res) => {
    try {
        const comicId = req.params.id;
        
        // Fetch comic details using ComicService
        const comic = await ComicService.getComicById(comicId);

        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }
        const filters = {
            comic_id : comicId
        }
        // Fetch all chapters of the comic using ChapterService
        const chapters = await ChapterService.getAllChapters(filters);

        // Send the combined result: comic details and its chapters
        return res.status(200).json({
            comic,
            chapters
        });
    } catch (error) {
        console.error('Error fetching comic details with chapters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getComicDetailsWithChapters
};
