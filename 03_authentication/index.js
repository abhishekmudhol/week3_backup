const express = require('express');
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5000
const jwtPassword = 'abhishek@25'
const app = express()

app.use(express.json())

const ALL_USERS = [
        {
        username: "harkirat@gmail.com",
        password: "123",
        name: "harkirat singh",
        },
        {
        username: "raman@gmail.com",
        password: "123321",
        name: "Raman singh",
        },
        {
        username: "priya@gmail.com",
        password: "123321",
        name: "Priya kumari",
        },
    ];

function userExist(username , password){
    let isExist = false
    ALL_USERS.forEach((item)=>{
        if(item.username == username && item.password == password){
            isExist = true
        }
    })
        return isExist
}

 //Returns a json web token with username encrypted
app.post('/signin', (req , res)=>{         
    const username = req.body.username
    const password = req.body.password

    if (!userExist(username , password)) {
        res.status(411).json({
            message : "A USER NOT EXIST"
        })
        return;
    }

    const Token = jwt.sign({username : username} , jwtPassword)
    res.json({
        Token
    })
})

//Returns an array of all users if user is signed in (token is correct)  Returns 403 status code if not
app.get('/users', (req , res)=>{
    const token = req.headers['authorization']
    console.log(token);
    try {
        const decoded = jwt.verify(token , jwtPassword)
        const username = decoded.username

        const userArray = ALL_USERS.filter((item)=>{
                            return item.username != username
                            })
        res.status(200).json({
            userArray
        })
    } catch (error) {
        res.status(403).json({
            msg: "Invalid token",
        });
        return;
    }
})

app.listen(PORT , ()=>{
    console.log(`server is running on port ${PORT}`);
})
