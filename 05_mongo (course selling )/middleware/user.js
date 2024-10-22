const {User , Course} = require("../db/index")

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const username = req.headers.username
    const password = req.headers.password
    try {
        const user = await User.findOne({username , password})
        if (user) {
            req.userId = user._id
            next()
        }else{
            res.status(411).json({
                message : "user is not authenticated"
            })
        }
    } catch (error) {
        console.log(`Error in a user middleware ${error}`);
    }
}

module.exports = userMiddleware;