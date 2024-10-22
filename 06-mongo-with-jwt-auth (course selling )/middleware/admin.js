const { default: mongoose } = require("mongoose");
const { Admin, User, Course } = require('../db/index');
const jwt = require("jsonwebtoken");
const jwtPassword = "abhishek@2512"

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const authToken = req.headers.authorization

    if (!authToken) {
        res.status(411).json({
            message : "token required"
        })
        return;
    }
    
    let token;
    if (authToken.startsWith('Bearer ')) {
        token = authToken.split(' ')[1]
    }else{
        if (authToken.startsWith('Bearer')) {
            token = authToken.substring(6);
        } else {
            token = authToken
        }
    }

    //console.log(token);
    
    try {
        const decoded = jwt.verify(token , jwtPassword)

        const userId = decoded.userId
        const username = decoded.username

        const admin = await  Admin.findOne({_id : userId , username})
        if (admin) {
            req.adminId = admin._id
            next()
        }else{
            res.status(411).json({
                message :"Not Authenticated"
            })
        }
        // Input: Headers: { 'Authorization': 'Bearer <your-token>' }
    } catch (error) {
        console.error('Token verification is failed:', error.message);
        res.status(404).json({
            message : "Token verification is failed"
        })
    }
}

module.exports = adminMiddleware;