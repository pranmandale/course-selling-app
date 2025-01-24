
export const sendToken = async (user, statuscode, message, res) => {

    const token = await user.generateToken();
    const cookie_expire = process.env.COOKIE_EXPIRE || 1;

    res.status(statuscode).cookie("token", token, {
        expires: new Date(Date.now() + cookie_expire * 24 * 60 * 60 * 1000),
        httpOnly: true, // cant access cookie directly by using javascript
        secure: process.env.NODE_ENV === 'production',
        secure: 'strict', //prevent from CSRF attacks
    }).json({
        success: true,
        message,
        user,
        token
    })

}
