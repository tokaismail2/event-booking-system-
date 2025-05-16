const express = require('express'); 
const User = require('../models/userModel');
const { register, login , forgetPassword , verifyResetCode ,updatePassword} = require('../controllers/userControllers');


const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgetPassword',forgetPassword)
router.post('/verifyResetCode', verifyResetCode);  
router.put('/updatePassword', updatePassword); 









module.exports = router;




