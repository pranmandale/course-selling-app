import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const adminSchema = new mongoose.Schema({
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

    },
    password: {
        type: String,
        minlength: [5, "Password Must be at least 5 characters long"],
        select: false,
        required: true,
    },
    accountVerified: {
        type: Boolean,
    },
    verificationCode: {
        type: Number,
    },
    verificationCodeExpire: {
        type: Date,
    },
    resetPasswordToken: {
        type:String,
    },
    resetPasswordExpire: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})


adminSchema.pre("save", async function (next) {
    // if the password is not updated and this function is called then 
    // automatically calls next() function
    if (!this.isModified("password")) {
        next()
    }

    // if the password is updated or new password is added then password is hashed and stored into db
    this.password = await bcrypt.hash(this.password, 10)
})


adminSchema.methods.comparePassword = async function (enteredPassword)  {
    return await bcrypt.compare(enteredPassword, this.password)
}

adminSchema.methods.generateToken = async function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_ADMIN, {
        expiresIn: process.env.JWT_ADMIN_EXPIRY
    })
}


// in this function reset password token is generated
adminSchema.methods.generateResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;

}


export const Admin = mongoose.model("Admin", adminSchema)