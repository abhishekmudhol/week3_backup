const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, User, Course } = require('../db/index');
const { default: mongoose } = require("mongoose");

async function userExist(username , password){
    let isExist = false
    try {
        let user = await Admin.findOne({username , password})
        if(user){
            isExist = true
        }
    } catch (error) {
        console.log(`error from a userExist function ${error}`);
    }
    return isExist
}

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    // Creates a new admin account.
    const adminUsername = req.body.username
    const adminPassword = req.body.password

    if (!adminUsername || !adminPassword) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // userExist()
    let isExist =  await userExist(adminUsername , adminPassword)
            if(isExist){
                res.status(411).send(`USER EXIST`)
                return;
            }

    let newAdminUser = new Admin({
        username : adminUsername,
        password : adminPassword
    })

    newAdminUser.save()
        .then((admin) => {
            res.status(200).json({
                admin,
                message : "Admin is sucssesfully created"
            })
        }).catch((err) => {
            console.log(`error from a /signup route ${err}`);
        });
});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
    // Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com' }
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price
    const imageLink = req.body.imageLink

    const newCourse = new Course({
        title,
        description,
        price,
        imageLink,
        createdBy: new mongoose.Types.ObjectId(req.adminId)
    })
    newCourse.save()
        .then((course) => {
            res.status(200).json({ 
                message: 'Course created successfully', 
                courseId: course._id   //Either course.id or course._id will provide you with the ID of the newly created course.
            })
        }).catch((err) => {
            console.log(`error from a /signup route ${err}`);
        });
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    try {
        const courses = await Course.find({})
        res.status(200).json({
            courses
        })
    } catch (error) {
        console.log(`error from a /courses (GET) route ${error}`);
    }
});

module.exports = router;