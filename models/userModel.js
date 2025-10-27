import mongoose from "mongoose";
import validator from "validator";

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
        minlength: [8, 'A user password must have more or equal then 8 characters']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user must have a password'],
    }
});
const User = mongoose.model("User", userSchema);

export default User;