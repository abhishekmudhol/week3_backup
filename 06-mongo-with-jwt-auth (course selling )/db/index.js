const mongoose = require('mongoose');

// Connect to MongoDB  
mongoose.connect('mongodb+srv://abhishekmudhol:u8x5d1WRYOKzdhUs@clusterlearning.6jhaqdc.mongodb.net/course_selling_app');

// mongoose.connection.once('open', () => {
//     console.log('Connected to MongoDB');
//   }).on('error', (error) => {
//     console.log('Error connecting to MongoDB:', error);
//   });

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username : {type : String , required : true},
    password : {type : String , required : true},
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username : {type : String , required : true},
    password : {type : String , required : true},
    enrolledCourses : [{type : mongoose.Schema.Types.ObjectId , ref : 'Course'}]
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title : {type : String  , required : true},
    description : {type : String  , required : true},
    price : {type : Number , required : true},
    imageLink: String,
    createdBy : {type : mongoose.Schema.Types.ObjectId , ref : 'Admin'}
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}