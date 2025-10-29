import User from "../models/userModel.js";
import CatchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";

export const signup = CatchAsync(async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

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

    if (!correct || await user.correctPassword(password, user.password)) {
        return next(new Error('Incorrect email or password'),401);
    }

    let token = ''
    res.status(200).json({
        status: 'success',
        token
    });
});
