import jwt from "jsonwebtoken"
import ErrorHandler from "./error.middleware.js";
import { catchAsyncError } from "./catchAsyncError.js";


// this function us used to extract token when user is purchasing a course 
// the token is of user
export const userMiddleware = catchAsyncError(async (req, res, next) => {
    const authHeader = req.headers.authorization; // Get the Authorization header

    // Check if the Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return next(new ErrorHandler("No token provided", 404));
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]; // Split "Bearer <token>" to get the token

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user ID to the request object
        req.userId = decoded.id;
        next(); // Pass control to the next middleware or route handler
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 403));
    }
});

