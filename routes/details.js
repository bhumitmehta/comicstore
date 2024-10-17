const express = require('express');
const comicDetailsController= require('../controllers/detailsController');

const router = express.Router();


router.get('/:id', comicDetailsController.getComicDetailsWithChapters);
module.exports = router;

