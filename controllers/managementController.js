const ComicService = require('../services/comicService'); // Adjust the path as necessary
const ChapterService = require('../services/chapterService'); // Adjust the path as necessary
const { validateComic, validateChapter ,validateUpdateChapter,validateUpdateComic } = require('../utils/validation'); // Adjust the path as necessary

// Management Controller
const managementController = {
    // Add a new comic book
    addComic: async (req, res) => {
        try {
            // Validate input
            const { error } = validateComic(req.body); 
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
    
            const comicData = req.body;
    
            // Attempt to add the comic
            const newComic = await ComicService.addComic(comicData);
    
            // Check if the comic was added successfully
            console.log(newComic)
            if (newComic) {
                return res.status(201).json({ message: newComic.message });
            } else {
                return res.status(500).json({ message: "Failed to add comic, please try again later." });
            }
        } catch (error) {
            console.error(error);
            
            // Differentiate between error types
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "Comic with this name already exists." });
            }
    
            return res.status(500).json({ message: 'Error adding comic', error: error.message });
        }
    },
    

    // Add a new chapter to a comic
    addChapter: async (req, res) => {
        try {
            const { error } = validateChapter(req.body); // Validate input
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const chapterData = req.body;
            const newChapter = await ChapterService.addChapter(chapterData);
            return res.status(201).json({message:"chapter added successfully"});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message }); 
        }
    },

    // Update a comic
    updateComic: async (req, res) => {
        
        const id = req.params.id;
        console.log(id)
        try {
            const { error } = validateUpdateComic(req.body);
            
            if (error) {
                console.log(error)
                return res.status(400).json({ message: error.details[0].message });
            }
            console.log("here")
            await ComicService.updateComic(id, req.body);
            return res.status(200).json({
                message : "comic updated successfully "
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error updating comic', error });
        }
    },

    // Delete a comic
    deleteComic: async (req, res) => {
        const id = req.params.id;
        try {
            await ComicService.deleteComic(id);
            return res.status(204).json({message:'Deleted Successfully'}); // No content to send back
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: `Error deleting comic ${error}` });
        }
    },
    // Update a chapter
    updateChapter: async (req, res) => {
        const id = req.params.id;
        try {
            req.body.id  = id
            const { error } = validateUpdateChapter(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const updatedChapter = await ChapterService.updateChapter(id, req.body);
            return res.status(200).json({message:`chapter updated successfully`});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error updating chapter', error });
        }
    },

    // Delete a chapter
    deleteChapter: async (req, res) => {
        const id = req.params.id;
        try {
            await ChapterService.deleteChapter(id);
            return res.status(204).json({message:"chapter deleted successfully"}) // No content to send back
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting chapter', error });
        }
    },
};

module.exports = managementController;
