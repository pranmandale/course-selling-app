import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        minlength: [5, "Password Must be at least 5 characters long"],
        select: false,
        required: true,
    },
    accountVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: Number,
    },
    verificationCodeExpire: {
        type: Date
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// before saving the user into schema  this function will automatically execute
userSchema.pre("save", async function (next) {
    // if the password is not modified then call to next
    if (!this.isModified("password")) {
        next();
    }

    // if the password is modified or new user is trying to register 
    // so before saving that user password field must be checked like this..
    this.password = await bcrypt.hash(this.password, 10);
})


// this function is for comparing password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// this function is for creating token 
userSchema.methods.generateToken = async function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}


// in this function reset password token is generated 
userSchema.methods.generateResetPasswordToken =  function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    return resetToken;

}


export const User = mongoose.model("User", userSchema);