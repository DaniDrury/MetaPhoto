const router = require('express').Router();
const photosRouter = require('./photos.js');

router.use('/photos', photosRouter);

module.exports = router;

