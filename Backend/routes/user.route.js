import express from "express"
import { forgotPassword, getUser, login, logOut, resetPassword, signUp, verifyOTP } from "../controllers/user.controller.js"
const router = express.Router()

router.post("/signup", signUp);

router.post("/otp-verification", verifyOTP)

router.post("/login", login);

router.get("/logout", logOut)

router.get("/getUser", getUser)

router.post("/password/forgot",forgotPassword)

router.put("/password/reset/:token", resetPassword)



export default router;