const express = require('express');
const router = express.Router();
const managementController = require('../controllers/managementController');


// Add , Update , delete comics routes 
router.post('/comics',managementController.addComic);
router.put('/comics/:id', managementController.updateComic);
router.delete('/comics/:id', managementController.deleteComic);



// Add ,update ,delete chapter routes
router.post('/comics/chapters', managementController.addChapter);
router.put('/chapters/:id', managementController.updateChapter);
router.delete('/chapters/:id', managementController.deleteChapter);

module.exports = router;
