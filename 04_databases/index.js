



// use zod








const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5000
const jwtPassword = "@bhishek"
const app = express()
app.use(express.json())

mongoose.connect('mongodb+srv://abhishekmudhol:u8x5d1WRYOKzdhUs@clusterlearning.6jhaqdc.mongodb.net/users_app')

const userSchema = new mongoose.Schema({
    username : String,
    password : { type : String , required : true},
    email    : String
})

const userModel = new mongoose.model("User" , userSchema)

async function userExist(username , password){
    let isExist = false

    try {
        let user = await userModel.findOne({username , password})
        if (user) {
            isExist = true
        }
    } catch (error) {
        console.log(`error from userExist function ${err}`)
    }
    return isExist
}

app.post('/signup' , async (req , res)=>{
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email

    let resultUserExist = await userExist(username , password)
    if(resultUserExist){
        res.status(411).json({
            message : "USER EXISTS"
        })
        return;
    }

    const newUser = new userModel({
        username,
        password,
        email
    })

    newUser.save()
        .then((user)=>{
            res.status(200).json({
                user
            })
        })
        .catch((err)=>{
            console.log(`error from signup route ${err}`);
        })
})

app.post('/login' , async (req , res)=>{
    const username = req.body.username
    const password = req.body.password

    let resultUserExist = await userExist(username , password)
    if(!resultUserExist){
        res.status(411).json({
            message : "USER IS NOT EXIST..signup first"
        })
        return;
    }

    const token = jwt.sign({username : username} , jwtPassword)
    res.status(200).json({
        token
    })
})

app.get('/users' , async (req,res)=>{
    try {
        const token = req.headers.authorization

        const decoded = jwt.verify(token , jwtPassword)
        const username = decoded.username

        let users = await userModel.find()

        let userArray = users.filter((user)=>{
            return user.username != username
        })

        res.status(200).json({
            userArray
        })
    } catch (err) {
        res.status(403).json({
            msg: "Invalid token",
        });
        console.log(`error from /users ${err}`);
    }
})

app.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`);
})