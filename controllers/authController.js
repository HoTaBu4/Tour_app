import User from "../models/userModel.js";
import CatchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

export const signup = CatchAsync(async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        }
    });
});

export const login = CatchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new Error('Please provide email and password!'));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password')

    if (!user || await user.correctPassword(password, user.password)) {
        return next(new Error('Incorrect email or password'),401);
    }

    let token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

export const protect = CatchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(new Error('You are not logged in! Please log in to get access.', 401));
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    next();
});
