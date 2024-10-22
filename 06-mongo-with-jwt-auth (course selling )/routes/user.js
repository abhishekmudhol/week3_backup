const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User , Course} = require("../db/index");
const jwt = require("jsonwebtoken");
const jwtPassword = "abhishek@2512"

async function userExist(username , password){
    let isExist = false
    try {
        const user = await User.findOne({username , password})
        if (user) {
            isExist = true
        }
    } catch (error) {
        console.log(`error from a userexist function`);
    }
    return isExist
}

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic

    const username = req.body.username
    const password = req.body.password

    if(!username || !password){
        res.status(411).json({
            message : "Username and password are required"
        })
        return;
    }

    let isExist = await userExist(username , password)
    if (isExist) {
        return res.status(411).json({message : "USER EXIST"})
    }

    const newUser = new User({
        username,
        password
    })
    newUser.save()
        .then((user)=>{
            res.status(200).json({
                message: 'User created successfully' 
            })
        })
        .catch((err)=>{
            console.log(`error while saving user into database ${err}`);
        })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password

    if(!username || !password){
        res.status(400).json({
            message : "username and password required"
        })
        return;
    }

    const user = await User.findOne({username , password})
    if (user) {
        const token = jwt.sign({userId : user._id , username} , jwtPassword)

        res.status(200).json({
            token
        })
    }else{
        res.status(400).json({
            message : "No user found with provided credentials....signup"
        })
    }
});

router.get('/courses',async (req, res) => {
    // Implement listing all courses logic

    try {
        let courses = await Course.find({})
        res.status(200).json({
            courses
        })
    } catch (error) {
        console.log(`error in a /user/course ${error}`);
    }
});

router.post('/courses/:courseId', userMiddleware , async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId
    const userId = req.userId

    try {
        const course = await Course.findById(courseId)
        if (!course) {
            res.status(411).json({
                message : "COURSE IS NOT EXIST"
            })
            return;
        }

        const updatedUser = await User.findOneAndUpdate(
            {_id : userId},
            {$addToSet : {enrolledCourses : courseId}},
            {new : true , useFindAndModify : false}
        )

        if(!updatedUser){
            return res.status(411).json({
                message : "updatedUser is a null"
            })
        }
        
        res.status(200).json({
            message: 'Course purchased successfully',
            updatedUser
        })
    } catch (error) {
        console.log(`error in a /user/courses/:courseId Route ${error}`);
    }
});

router.get('/purchasedCourses', userMiddleware , async (req, res) => {
    // Implement fetching purchased courses logic
    const userId = req.userId
    try {

        const user = await User.findById(userId).populate({
            path : "enrolledCourses",
            select : "id title description price imageLink "
        })

        // const purchasedCourses = user.enrolledCourses.map(course => ({
        //     id: course._id, // Assuming _id is the ObjectId of the course
        //     title: course.title,
        //     description: course.description,
        //     price: course.price,
        //     imageLink: course.imageLink,
        // }));

        res.status(200).json({
            purchasedCourses : user.enrolledCourses 
        })
    } catch (error) {
        console.log(`error in a /user/purchasedCourses ${error}`);
    }
});

router.all('*' ,(req, res, next) => {
    res.status(404).json({
        message : "Route is not found"
    })
});

module.exports = router


