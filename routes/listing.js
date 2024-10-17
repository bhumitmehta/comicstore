const express = require('express');
const { getComicBooks ,getChapters } = require('../controllers/listingController');

const router = express.Router();

router.get('/comics', getComicBooks);

router.get('/chapters', getChapters);
module.exports = router;
