export const sendToken = async (user, statusCode, message, res) => {
    const token = await user.generateToken();
    const cookie_expire = process.env.COOKIE_EXPIRE || 1;

    res.status(statusCode)
        .cookie("token", token, {
            expires: new Date(Date.now() + cookie_expire * 24 * 60 * 60 * 1000),
            httpOnly: true, // Prevents JavaScript access
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict", // Prevents CSRF attacks
        })
        .json({
            success: true,
            message,
            user,
            token, // Now returning token in response as well
        });
};
