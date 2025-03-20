// backend business logic related to courses
import { catchAsyncError } from "../middleware/catchAsyncError.js"
import ErrorHandler from "../middleware/error.middleware.js"
import { Course } from "../models/course.model.js"
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";


import dotenv from "dotenv";
dotenv.config();



// this function is for creating a new course
export const createCourse = catchAsyncError(async (req, res, next) => {
    const adminId = req.adminId;
    
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
            // we are sending adminId here also to check which admin has created this course
            creatorId: adminId,
            
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
        const adminId = req.adminId;
        const { courseId } = req.params;
        const { title, description, price, image } = req.body;


        const courseSearch = await Course.findById(courseId)
        if (!courseSearch) {
            return next(new ErrorHandler("Course Not Found! please try again", 404))
        }

        
        // const course = await Course.findByIdAndUpdate(
        const course = await Course.updateOne(
            // courseId, // Find by courseId
            {
                _id: courseId,
                creatorId: adminId,
            },
            
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
    const adminId = req.adminId;
    try {
        const course = await Course.findOneAndDelete({
            _id: courseId,
            creatorId: adminId,
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


// import Stripe from "Stripe"
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET)
// console.log(process.env.STRIPE_SECRET)

export const buyCourses = catchAsyncError(async (req, res, next) => {
    const { userId } = req;
    const { courseId } = req.params;


    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is missing" });
    }

    if (!courseId) {
        return res.status(400).json({ success: false, message: "Course ID is missing" });
    }

    try {
        const courseData = await Course.findById(courseId);
        if (!courseData) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const existingPurchase = await Purchase.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(400).json({ success: false, message: "You have already purchased this course!" });
        }


        // payment gateway code is written here

        const amount = courseData.price;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types:["card"]
        });


        const newPurchase = await Purchase.create({ userId, courseId });

        return res.status(200).json({
            success: true,
            message: "Course purchased successfully!",
            purchasedCourse: courseData.title,
            user_and_courseId: newPurchase,
            courseData,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error purchasing course:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
