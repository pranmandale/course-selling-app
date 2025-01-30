import { z } from "zod";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.middleware.js";
import {Admin} from "../models/admin.model.js"; 
import { sendTokenAdmin } from "../utils/sendTokenAdmin.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"


export const signUp = catchAsyncError(async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Define validation schema using zod
        const adminSchema = z.object({
            firstName: z.string().min(2, { message: "First Name must be at least 2 characters long" }),
            lastName: z.string().min(2, { message: "Last Name must be at least 2 characters long" }),
            email: z.string().email({ message: "Invalid email format" }),
            phone: z.string().regex(/^\+91[6-9]\d{9}$/, { message: "Invalid Phone Number! Use Indian format (+91)" }),
            password: z.string().min(5, { message: "Password must be at least 5 characters long" }),
        });

        // Validate request data
        const validateData = adminSchema.safeParse(req.body);
        if (!validateData.success) {
            return next(new ErrorHandler("Validation Error", 422, validateData.error.issues.map(err => err.message)));
        }

        // Check if email or phone is already registered
        const existingAdmin = await Admin.findOne({
            $or: [
                { email, accountVerified: true },
                { phone, accountVerified: true },
            ],
        });

        if (existingAdmin) {
            return next(new ErrorHandler("Admin already exists. No need to create an account", 409));
        }

        const { verificationCode, verificationCodeExpire } = generateVerificationCode();

        

        req.session.tempAdmin = {
            firstName,
            lastName,
            email,
            phone,
            password,
            verificationCode,
            verificationCodeExpire
        }

        sendVerificationCode(verificationCode, email);

        res.status(202).json({
            success: true,
            message: "verification code sent to your email"
        })
    } catch (error) {
        return next(error)
    }
    

    
});


function generateVerificationCode() {
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    return {
        verificationCode,
        verificationCodeExpire: Date.now() + 5 * 60 * 1000, // Expires in 5 minutes
    };
}

const sendVerificationCode = async (verificationCode, email) => {
    try {
        const message = generateEmailTemplate(verificationCode)
        await sendEmail({ email, subject: "Your Verification Code", message })
    } catch (error) {
        throw new Error("verification code failed to send")
    }
}

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
    try {
        const { email, otp } = req.body;
        
        const tempAdmin = req.session.tempAdmin;

        if (!tempAdmin || tempAdmin.email !== email) {
            return next(new ErrorHandler("Invalid or Expired session please signup again", 400))
        }

        const { verificationCode, verificationCodeExpire, firstName, lastName, phone, password } = tempAdmin;

        if (Number(otp) !== verificationCode) {
            return res.status(404).json({
                message: "Invalid OTP, please try again!"
            })
        }
        const currentTime = Date.now()
        if (currentTime > verificationCodeExpire) {
            return res.status(404).json({
                message: "verification code expired please try again!"
            })
        }

        const admin = await Admin.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            accountVerified: true,
        })

        req.session.tempAdmin = null;

        sendTokenAdmin(admin, 200, "Admin verified and Registered Successfully!", res)

        
    } catch (error) {
        return next(error)
    }
})

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return next(new ErrorHandler("Email and password are required", 400));
    }

    // Find admin by email, including password
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
        return next(new ErrorHandler("Invalid email or password", 401)); // Generic error for security
    }

    // Compare provided password with stored hashed password
    const isPasswordMatch = await admin.comparePassword(password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 401)); // Same generic error
    }

    // Send token upon successful login
    sendTokenAdmin(admin, 200, "login successful", res)
});


export const logOut = catchAsyncError(async (req, res, next) => {
  try {
      
      const token = req.cookies.token;

      if (!token) {
          return next(new ErrorHandler("No token found", 400))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN)
      const adminId = decoded.id;

      const admin = await Admin.findById(adminId)
      if (!admin) {
          return next(new ErrorHandler("admin not found", 400))
      }

      res
          .status(200)
          .cookie("token", "", {
          expires: new Date(Date.now()),
          httpOnly: true
          })
          .json({
              success: true,
              message: `${admin.lastName} logout successful!`
          })
  } catch (error) {
    return next(error)
  }
})



export const forgotPassword = catchAsyncError(async (req, res, next) => {
    try {
        const {email} = req.body;

        const admin = await Admin.findOne({
            email,
            accountVerified: true,
        })

        if (!admin) {
            return next(new ErrorHandler("Admin Not found!", 404))
        }

        const resetPasswordToken = admin.generateResetPasswordToken();
        await admin.save({ validateBeforeSave: false })
        

        const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetPasswordToken}`

        const message = `Your Reset password url is \n\n ${resetPasswordUrl} \n\n`

        try {
           
           sendEmail({ email, subject: "Reset Password", message })

           return res.status(200).json({
               success: true,
               message: "Password Reset link sent to your email please check and click to reset password"
           })
       } catch (error) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save({ validateBeforeSave: false })
                
                return next(new ErrorHandler("password rest email unable to send",  404))
       }
    } catch (error) {
        return next(error)
    }
})


export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.params
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

    const admin = await Admin.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!admin) {
        return next(new ErrorHandler("Your reset password token expired please try again!", 404))
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("password and confirm password should be match", 404))
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save()

    sendTokenAdmin(admin, 200,"password reset successfully", res)
    
})
