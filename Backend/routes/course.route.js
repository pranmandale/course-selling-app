import express from "express"
import { buyCourses, courseDetail, createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller.js"
import { userMiddleware } from "../middleware/user.mid.validateToken.js"
const router = express.Router()



router.post("/create", createCourse)
router.put("/update/:courseId", updateCourse)
router.delete("/delete/:courseId", deleteCourse)
router.get("/get", getCourses);
router.get("/:courseId", courseDetail)

router.post("/buy/:courseId", userMiddleware, buyCourses)

export default router