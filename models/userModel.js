import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
      minlength: [10, 'A user name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'User name must only contain characters']
    },
    email: {
        type: String,
        required: [true, 'A user must have a email'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        maxlength: [15, 'A user password must have less or equal then 15 characters'],
        minlength: [8, 'A user password must have more or equal then 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user must have a password'],
        // this works only on CREATE and SAVE!!!
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    }
});

userSchema.pre('save', async function(next) {
    // Only run this function if password was NOT modified
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field so it doesn't persist
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model("User", userSchema);

export default User;
