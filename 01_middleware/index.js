const express = require('express');
const app = express();


function middleware1(req, res, next) {
    req.startTime = new Date().getTime()
    
    next()
}

app.get('/', middleware1,  (req, res) => {
    let a = 0
    setTimeout(()=>{
        a++
    },4000)

    res.status(200).send(`total time ${a}`);
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})