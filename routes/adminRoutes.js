const express = require('express');
const { createEvent, updateEvent, deleteEvent } = require('../controllers/adminControllers');
const { authenticateUser, isAdmin } = require('../middlewares/authenticateUser');
const router = express.Router();

router.use(authenticateUser);
router.use(isAdmin);

router.post('/events', createEvent);
// router.get('/events', getEvents);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;
