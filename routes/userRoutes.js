const express = require('express'); 
const User = require('../models/userModel');
const { register, login , forgetPassword , verifyResetCode ,updatePassword , getEvents} = require('../controllers/userControllers');


const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgetPassword',forgetPassword)
router.post('/verifyResetCode', verifyResetCode);  
router.put('/updatePassword', updatePassword); 
router.get('/events', getEvents); // user can see all events









module.exports = router;




