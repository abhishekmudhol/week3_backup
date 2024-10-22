const jwt = require("jsonwebtoken");
const jwtPassword = "abhishek@2512"
const {User , Course} = require("../db/index")

async function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const authToken = req.headers.authorization
    if (!authToken) {
        res.status(400).json({
            message : "Token required"
        })
        return;
    }

    let token;
    if (authToken.startsWith('Bearer ')) {
        token = authToken.split(' ')[1]
    } else {
        if (authToken.startsWith('Bearer')) {
            res.status(400).json({
                message : "should be gap between Bearer and Token i.e. Bearer <your-token> "
            })
            return;
        } else {
            token = authToken
        }
    }

    try {
        const decoded = jwt.verify(token , jwtPassword)

        const userId = decoded.userId
        const username = decoded.username
        
        const user = await User.findOne({_id : userId , username})
        if (user) {
            req.userId = user._id
            next()
        }else{
            res.status(411).json({
                message : "user is not authenticated"
            })
        }
    } catch (error) {
        console.error('Token verification is failed:', error.message);
        res.status(404).json({
            message : "Token verification is failed"
        })
    }
}

module.exports = userMiddleware;