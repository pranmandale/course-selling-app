import express from "express"
import { forgotPassword, login, logOut, resetPassword, signUp, verifyOTP } from "../controllers/admin.controller.js";


const router = express.Router();


router.post("/signup", signUp);

router.post("/verify-otp", verifyOTP)

router.post("/password/forgot", forgotPassword)

router.put("/password/reset/:token", resetPassword)

router.post("/login", login)

router.get("/logout", logOut)

export default  router;