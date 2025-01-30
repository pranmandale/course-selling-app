import jwt from "jsonwebtoken"
import ErrorHandler from "./error.middleware.js";
import { catchAsyncError } from "./catchAsyncError.js";


// this function us used to extract token when admin is trying to create, update, delete course
export const adminMiddleware = catchAsyncError(async (req, res, next) => {
    const authHeader = req.headers.authorization; // Get the Authorization header

    // Check if the Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return next(new ErrorHandler("No token provided ", 404));
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]; // Split "Bearer <token>" to get the token

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

        // Attach the decoded adminID to the request object
        // this adminId we are using in course creation, update and delete
        req.adminId = decoded.id;
        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token or unauthorized user", 403));
    }
});

