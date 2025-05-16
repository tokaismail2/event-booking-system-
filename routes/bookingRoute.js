// routes/bookingRoutes.js
const express = require('express');
const { authenticateUser } = require('../middlewares/authenticateUser');
const { bookEvent } = require('../controllers/bookingController');
const router = express.Router();

router.post('/:eventId', authenticateUser, bookEvent);

module.exports = router;
