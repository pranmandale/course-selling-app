import express from "express"
import { forgotPassword, getUser, login, logOut, purchases, resetPassword, signUp, verifyOTP } from "../controllers/user.controller.js"
import { userMiddleware } from "../middleware/user.mid.validateToken.js";
const router = express.Router()

router.post("/signup", signUp);

router.post("/otp-verification", verifyOTP)

router.post("/login", login);

router.get("/logout", logOut)

router.get("/getUser", getUser)

router.post("/password/forgot",forgotPassword)

router.put("/password/reset/:token", resetPassword)

router.get("/purchases", userMiddleware, purchases)


export default router;