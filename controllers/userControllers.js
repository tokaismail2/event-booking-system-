const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const responseWrapper = require('../utils/responseWrapper');
const responseTypes = require('../utils/responseTypes');
const ApiError = require('../utils/apiError');
const checkMail = require('../utils/checkMail'); 
require("dotenv").config();
const crypto = require('crypto'); //hashing reset code
const { sendEmail } = require('../utils/sendEmail'); //send email

const Event = require('../models/eventsModel'); 


//register
const register = async (req, res, next) => {
    try {
        const { name, email, password ,role} = req.body;

        if (!name || !email || !password  || !role) {
            return next(new ApiError("All fields are required", responseTypes.BAD_REQUEST.code));
        }
        const findEmail = await User.findOne({ 'email.emailAddress': email });
        if (findEmail) {
            return next(new ApiError("Email is already in use", responseTypes.BAD_REQUEST.code));
        }
        const isEmailValid = await checkMail(email);
        if (isEmailValid === 'UNDELIVERABLE') {
            return next(new ApiError("Invalid email address", responseTypes.BAD_REQUEST.code));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: { emailAddress: email, isVerified: false },
            password: hashedPassword,
            role,

          
        });
        const savedUser = await newUser.save();

         const generateTokens = (userId, role) => {
            const ACCESS_TOKEN = jwt.sign({ userId, role }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const REFRESH_TOKEN = jwt.sign({ userId, role }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
            return { ACCESS_TOKEN, REFRESH_TOKEN };
        };

        const { ACCESS_TOKEN, REFRESH_TOKEN } = generateTokens(savedUser._id, savedUser.role);

        responseWrapper(res,responseTypes.CREATED,"User registered successfully", {ACCESS_TOKEN, REFRESH_TOKEN});

    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};



///login

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

         const user = await User.findOne({ 'email.emailAddress': email });


        if (!user) {
            return next(new ApiError("Email is not registered", responseTypes.NOT_FOUND.code));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new ApiError("Invalid password", responseTypes.UNAUTHORIZED.code));
        }

        const ACCESS_TOKEN = jwt.sign(
            {userId: user._id , role: user.role},
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );

        const REFRESH_TOKEN = jwt.sign(
            {userId: user._id, role: user.role},
            process.env.JWT_REFRESH_TOKEN_SECRET,
            {expiresIn: "7d"}
        );

        responseWrapper(res, responseTypes.SUCCESS, "User logged in successfully", {ACCESS_TOKEN, REFRESH_TOKEN});

    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }

};

//forget password
//three steps : forget password, verify resest code, update password
//1) forget password

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ 'email.emailAddress': email });
        if (!user) {
            return next(new ApiError("Email is not registered", responseTypes.NOT_FOUND.code));
        }
//send resest code        

        // Generate reset code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

        // Update user fields
        user.passwordResetCode = hashedResetCode;
        user.resetCodeExpire = Date.now() + 10 * 60 * 1000; // 10 mins
        user.email.isVerified = false;

        await user.save();
//send reset code to email
await sendEmail({
            to: user.email.emailAddress,
            subject: "Password Reset Code",
            message: `Your password reset code is ${resetCode}. It is valid for 10 minutes.`,
        });
        // TODO: Send resetCode to email using a mail service like nodemailer

        return responseWrapper(res, responseTypes.SUCCESS, "Reset code sent to your email");
    } catch (error) {
        return next(new ApiError(responseTypes.SERVER_ERROR.message, responseTypes.SERVER_ERROR.code));
    }


};


    //2) verify reset code
const verifyResetCode = async (req, res, next) => {
//get user based reset code
 const hashedResetCode = crypto.createHash('sha256').update(req.body.passwordResetCode).digest('hex');
 const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    resetCodeExpire: { $gt: Date.now() }, // Check if the code is still valid
 });
 if(!user) {
    return next(new ApiError("Invalid or expired reset code", responseTypes.UNAUTHORIZED.code));
 }
 user.passwordIsVerified=true;
 await user.save();
 return responseWrapper(res, responseTypes.SUCCESS, "Reset code verified successfully");

}

//3) update password
const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ "email.emailAddress": req.body.email });
        if (!user) {
            return next(new ApiError("User not found", responseTypes.NOT_FOUND.code));
        }
        if (!user.passwordIsVerified) {
            return next(new ApiError("Reset code not verified", responseTypes.UNAUTHORIZED.code));
        }
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        user.password = hashedPassword;
        user.passwordResetCode = null;
        user.resetCodeExpire = null;
        user.passwordIsVerified = false;
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        return responseWrapper(res, responseTypes.SUCCESS, "Password updated successfully", { token });
    } catch (error) {
        return next(new ApiError(responseTypes.SERVER_ERROR.message, responseTypes.SERVER_ERROR.code));
    }
};

//user can see all events
const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    return responseWrapper(res, responseTypes.SUCCESS, 'Events fetched successfully', events);
  } catch (error) {
    return next(new ApiError(error.message, responseTypes.SERVER_ERROR.code));
  }
};


module.exports = { register, login ,forgetPassword ,verifyResetCode ,updatePassword,getEvents};