const { default: mongoose } = require("mongoose");
const { Admin, User, Course } = require('../db/index');

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const username = req.headers.username
    const password = req.headers.password

    const user = await  Admin.findOne({username , password})
    if (user) {
        req.adminId = user._id
        next()
    }else{
        res.status(411).json({
            message :"Not Authentication"
        })
    }
    //Input: Headers: { 'username': 'username', 'password': 'password' }
}

module.exports = adminMiddleware;