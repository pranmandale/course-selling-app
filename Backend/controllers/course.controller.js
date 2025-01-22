// backend business logic related to courses
import { catchAsyncError } from "../middleware/catchAsyncError.js"
import ErrorHandler from "../middleware/error.middleware.js"
import { Course } from "../models/course.model.js"
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";


// this function is for creating a new course
export const createCourse = catchAsyncError(async (req, res, next) => {
    try {
        const { title, description, price } = req.body;
        if (!title || !description || !price ) {
            return next (new ErrorHandler("All fields are required!", 400))
        }

        const { image } = req.files;
        if (!req.files || Object.keys(req.files).length === 0) {
            return next (new ErrorHandler("No Image file is uploaded", 400))
        }    


        // WE cannot directly store image into database we can store URL of that image
        // so for that we upload image into cloud then we store url of that image into database
        const allowedFormat = ["image/png", "image/jpeg"]
        if (!allowedFormat.includes(image.mimetype)) {
            return next (new ErrorHandler("Invalid file format, only png or jpg files are allowed", 400))
        }

        // cloudinary code
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return next (new ErrorHandler("error uploading file to cloudinary", 400))
        }
        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url,
            },
        }
        const course = await Course.create(courseData)
        res.status(200)
            .json({
                success: true,
                message: "Course created Successfully!",
                course
            })
        
    } catch (error) {
       next(error)
    }
})

// this function is for updating a course based on id passed in URL or get by params
export const updateCourse = catchAsyncError(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { title, description, price, image } = req.body;

        
        const course = await Course.findByIdAndUpdate(
            courseId, // Find by courseId
            {
                title,
                description,
                price,
                image: {
                    public_id: image?.public_id,
                    url: image?.url,
                },
            },
            { new: true } // Option to return the updated document
        );

        if (!course) {
            return next(new ErrorHandler("No course found!", 400))
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            data: course,
        });

    } catch (error) {
        return next(error)
    }
})

// this function is for deleting a course based on id passed in url or get by params
export const deleteCourse = catchAsyncError(async (req, res, next) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findOneAndDelete({
            _id: courseId,
        })

        if (!course) {
            return next(new ErrorHandler("No course found!", 400))
        }

        return res.status(200).json({
            success: true,
            message: "course deleted successfully!"
        })
    } catch (error) {
        return next(error)
    }
})

// this function is for selecting all the courses from db
export const getCourses = catchAsyncError(async (req, res, next) => {
    try {
        const courses = await Course.find({});
        return res.status(201).json({
            success: true,
            message: "courses accessed successfully!",
            courses,
        })
    } catch (error) {
    return next(error)
    }
})

// this function is for getting a particular course detail based on id passed from url
export const courseDetail = catchAsyncError(async (req, res, next) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId)
        if (!course) {
            return next (new ErrorHandler("course not found!", 400))
        }

        return res.status(202).json({
            success: true,
            message: "course found successfully!",
            course
        })
    } catch (error) {
        return next(error)
    }
})


// this function is for when a user hits a route for purchasing a course
export const buyCourses = catchAsyncError(async (req, res, next) => {
    // Get userId from middleware and courseId from route params
    const { userId } = req;
    const { courseId } = req.params;

    try {
        // Check if the course exists in the Course database
        const courseData = await Course.findById(courseId);
        if (!courseData) {
            return next(new ErrorHandler("The course you want to purchase was not found!", 404));
        }

        // Check if the course is already purchased by the user
        const existingPurchase = await Purchase.findOne({ userId, courseId });
        if (existingPurchase) {
            return next(new ErrorHandler("You have already purchased this course!", 400));
        }

        // Store the purchased course in the Purchase database
        const newPurchase = await Purchase.create({ userId, courseId });

        // Return success response with the course title
        return res.status(200).json({
            success: true,
            message: "Course purchased successfully!",
            purchasedCourse: courseData.title, // Display the course title
            user_and_courseId : newPurchase
        });
    } catch (error) {
        return next(error); // Forward error to the global error handler
    }
});


