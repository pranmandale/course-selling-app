
export const sendTokenAdmin = async (admin, statuscode, message, res) => {
    const token = await admin.generateToken();
    const cookieExpiry = process.env.COOKIE_EXPIRE_ADMIN;

    res.status(statuscode).cookie("token", token, {
        expires: new Date(Date.now() + cookieExpiry * 48 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        secure: "strict"
    }).json({
        success: true,
        message: message,
        admin,
        token,
    })

}