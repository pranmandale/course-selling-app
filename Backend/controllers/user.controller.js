import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler, { errorHandler } from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { z } from "zod";
import { sendToken } from "../utils/sendToken.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"

export const signUp = catchAsyncError(async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        if (!firstName || !lastName || !email || !phone || !password) {
            return next(new ErrorHandler("all fields are required", 400));
        }
        const userSchema = z.object({
            firstName: z.string().min(2, { message: "FirstName should be at least 2 characters long" }),
            lastName: z.string().min(2, { message: "LastName should be at least 2 characters long" }),
            email: z.string().email(),
            password: z.string().min(5, { message: "Password must be at least 5 characters long" }),
        })

        const validateData = userSchema.safeParse(req.body)
        if (!validateData.success) {
            return res.status(400).json({ errors: validateData.error.issues.map(err => err.message) })
        
        }

        // validate email
        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        if (!validateEmail(email)) {
            return next(new ErrorHandler("Invalid Email!", 400))
        }

        // validate phone
        function validatePhoneNumber(phone) {
            const phoneRegex = /^\+91[6-9]\d{9}$/;
            return phoneRegex.test(phone);
        }

        if (!validatePhoneNumber(phone)) {
            return next(new ErrorHandler("Invalid Phone Number!", 400))
        }

        // check for existing user..
        const existingUser = await User.findOne({
            $or: [
                {
                    email,
                    accountVerified: true,
                },
                {
                    phone,
                    accountVerified: true,
                }
            ]
        })
        
        if (existingUser) {
            return next(new ErrorHandler("User Already exists", 404))
        }

        const registerAttemptByUser = await User.find({
            $or: [
                {
                    phone,
                    accountVerified:false,
                },
                {
                    email,
                    accountVerified:false,
                }
            ]
        })

        if (registerAttemptByUser.length > 3) {
            return next(new ErrorHandler("You have exceeded the maximum number of attempts (3), please try again after 1 hour!", 404))
        }

        const { verificationCode, verificationCodeExpire } = generateVerificationCode();

        req.session.tempUser = {
            firstName,
            lastName,
            email,
            phone,
            password,
            verificationCode,
            verificationCodeExpire,
        };
        sendVerificationCode(verificationCode, email, res);

        return res.status(200).json({
            success: true,
            message: "Verification code sent to your email",
        });

        
    } catch (error) {
        return next(error);
    }
})




function generateVerificationCode() {
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    return {
        verificationCode,
        verificationCodeExpire: Date.now() + 5 * 60 * 1000, // Expires in 5 minutes
    };
}




const sendVerificationCode = async (verificationCode, email) => {
    try {
        const message = generateEmailTemplate(verificationCode);
        await sendEmail({ email, subject: "Your Verification Code", message });

        // Only log success, do not send a response here
        console.log("Verification email sent successfully!");
    } catch (error) {
        console.error("Error sending verification email:", error);

        // Propagate the error back to the calling function
        throw new Error("Verification code failed to send");
    }
};




function generateEmailTemplate(verificationCode) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333;">
            <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <div style="text-align: center; background-color: #4CAF50; color: white; padding: 10px; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">Email Verification</h1>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
                    <p style="font-size: 16px; line-height: 1.5;">Thank you for signing up. Please use the verification code below to complete your registration:</p>
                    <div style="display: inline-block; margin: 20px 0; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #4CAF50; border: 1px dashed #4CAF50; border-radius: 4px; background: #f9fff9;">
                        ${verificationCode}
                    </div>
                </div>
                <div style="text-align: center; font-size: 14px; color: #777; margin-top: 20px;">
                    <p>If you did not request this code, you can ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}




export const verifyOTP = catchAsyncError(async (req, res, next) => {
    const { email, otp } = req.body;

    try {
        // Get the temporary user from the session
        const tempUser = req.session.tempUser;

        if (!tempUser || tempUser.email !== email) {
            return next(new ErrorHandler("Invalid or expired session. Please sign up again.", 400));
        }

        const { verificationCode, verificationCodeExpire, firstName, lastName, phone, password } = tempUser;

        // Check if the OTP matches
        if (Number(otp) !== verificationCode) {
            return next(new ErrorHandler("Invalid OTP!", 400));
        }

        // Check if the OTP has expired
        const currentTime = Date.now();
        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler("Verification code expired!", 400));
        }

        // Create and save the user in the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            accountVerified: true, // Mark the account as verified
        });

        // Clear the session to avoid reuse of OTP
        req.session.tempUser = null;

        return res.status(201).json({
            success: true,
            message: "User registered and verified successfully!",
            user,
        });
    } catch (error) {
        return next(error);
    }
});




export const login = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("All fields are required!", 404))
        }
        
        const user = await User.findOne({
            email,
            accountVerified: true,
        }).select("password")
        // The .select("password") ensures that only the password field is returned in the result, not the entire user document.
        
        if (!user) {
            return next(new ErrorHandler("User not found, please try again!", 404))
        }


        const isPasswordMatch = await user.comparePassword(password)
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Email or Password don't Match!", 404))
        }
        
        sendToken(user, 202, "Login successful!", res)
    } catch (error) {
        return next(error)
    }
})




export const logOut = catchAsyncError(async (req, res, next) => {

    try {
        // const token = req.cookie.token;
        const token = req.cookies.token;
        if (!token) {
            return next(new ErrorHandler("No Token found!", 404))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id;

        const user = await User.findById(userId)

        if (!user) {
            return next(new ErrorHandler("User not found!", 404))
        }
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
        }).json({
            success: true,
            message: `${user.email} logged out successful`
        })
    } catch (error) {
        return next(error)
    }
})




export const getUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    })
})




export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const {email} = req.body;

    const user =  await User.findOne({
        email,
        accountVerified: true,
    })

    if (!user) {
        return next(new ErrorHandler("User not found!", 404))
    }

    const resetPasswordToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // here URL is generated which is sent to users email
    // when user clicks on to below there is option for reset password will be displayed
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetPasswordToken}`

    const message = `Your Reset password url is \n\n ${resetPasswordUrl} \n\n`

    try {
        sendEmail({
            email: user.email,
            subject: "Reset Password",
            message
        })

        return res.status(202).json({
            success: true,
            message: `Password Reset Email sent to ${user.email} successfully!`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })
        
        return next(new ErrorHandler("password rest email unable to send",  404))
    }
})




export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Your Reset password Token expired, please try again later", 404))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler("Password and confirm password should be same", 404 ))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save(); 
    sendToken(user, 200, "Reset Password Successfully!", res)
})

