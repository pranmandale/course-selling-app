import express from "express"
import { buyCourses, courseDetail, createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller.js"
import { userMiddleware } from "../middleware/user.mid.validateToken.js"
import { adminMiddleware } from "../middleware/admin.mid.js"
const router = express.Router()


// here adminMiddleware is used this state that 
// only admin can create , update, delete course
router.post("/create",adminMiddleware, createCourse)
router.put("/update/:courseId",adminMiddleware, updateCourse)
router.delete("/delete/:courseId", adminMiddleware, deleteCourse)


router.get("/get", getCourses);
router.get("/:courseId", courseDetail)

router.post("/buy/:courseId", userMiddleware, buyCourses)

export default router