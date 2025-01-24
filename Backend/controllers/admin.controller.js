import { z } from "zod";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler, { errorHandler } from "../middleware/error.middleware.js";
import {Admin} from "../models/admin.model.js"; 
import { sendTokenAdmin } from "../utils/sendTokenAdmin.js";
import jwt from "jsonwebtoken"


export const signUp = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, phone, password } = req.body;

    // Define validation schema using zod
    const userSchema = z.object({
        firstName: z.string().min(2, { message: "First Name must be at least 2 characters long" }),
        lastName: z.string().min(2, { message: "Last Name must be at least 2 characters long" }),
        email: z.string().email({ message: "Invalid email format" }),
        phone: z.string().regex(/^\+91[6-9]\d{9}$/, { message: "Invalid Phone Number! Use Indian format (+91)" }),
        password: z.string().min(5, { message: "Password must be at least 5 characters long" }),
    });

    // Validate request data
    const validateData = userSchema.safeParse(req.body);
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

    
    
    // Create the admin
    const adminData = {
        firstName,
        lastName,
        email,
        phone,
        password
    };

    try {
        const admin = await Admin.create(adminData);

        res.status(201).json({
            success: true,
            message: "Admin registration successful",
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                phone: admin.phone,
            },
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to create admin. Please try again.", 500));
    }
});


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
              message: "Logout successful"
          })
  } catch (error) {
    return next(error)
  }
})
