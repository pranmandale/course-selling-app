import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { errorHandler } from "./middleware/error.middleware.js"
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import session from 'express-session';


dotenv.config()

const app = express()


// built in middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 60 * 1000 }, // 5-minute expiration
}));
app.use(cookieParser())

// cloudinary configuration code
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

// routes for courses
// defining routes
import courseRoute from "./routes/course.route.js"
// http://localhost:4000/api/v1/course/
app.use("/api/v1/course", courseRoute);
// 2.20



// routes for user
// defining routes
import userRoute from "./routes/user.route.js"
import cookieParser from "cookie-parser";
// http://localhost:4000/api/v1/user/
app.use("/api/v1/user", userRoute);




app.use(errorHandler);
export {app}