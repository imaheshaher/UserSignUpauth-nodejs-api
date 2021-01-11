const  express = require('express')
const app = express()
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const jsonParaser = bodyParser.json()
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const port = 3000
const {User,Cook} = require('../models/cook');
const { Router } = require('express')
require("../models/db")
const router=Router()

function isAuthenticated(req,res,next) {
    
    var t = req.headers.authorization
    console.warn(t)
    jwt.verify(t,"om",(err,decode) => {
        if(err) {
            res.json({'err':err})
        }
        req.user = decode.name
    })
    if(req.user) {
        User.updateOne({name:req.user},{$set:{token:t}})
        return next();
    }
    else {
        console.warn("Not authenticate")
    }
}
app.get('/', (req, res) => res.send('Hello World!'))

app.get('/users',(req,res) => {
    var a= []
    const data = User.find({}).then((result) => {
        
        res.json(result)
    })
})

app.post('/login',jsonParaser,function(req,res) {
    const user = {
        name:req.body.name,
        password:req.body.password
    }
    const d = User.findOne({name:'jay1'}).then(res => {
        let check = bcrypt.compareSync(user.password,res.password)
        console.warn(check)
    })
    if(user.name == 'om' && user.password == '123'){
        var token = jwt.sign({
            name:user.name
        },'om')
        req.header["auth"]=token
    }
    if(token) {
        data = {
            msg:"auth Success",
            token_is:token
        }
        req.headers.authorization=token
        
        req.user = user.name
       
        User.updateOne({name:'shiv'},{$set:{token:token}},(err,res) => {

        })

    }
    else {
        data = {
            msg:"Auth faild"
        }
    }
    res.json(data)
})
app.post('/register',jsonParaser,function(req,res) {
    let pass = req.body.password
     const p = bcrypt.hashSync(pass,10)
    const data = new User({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        about:req.body.about,
        address : req.body.address,
        token:1,
        password:p
    })
    console.warn(req.body.address[0].tel)
    data.save().then((result) => {
        res.json(result)
    }).catch((err) => {
        console.warn(err)
    })
})


app.post('/cook',jsonParaser,function(req,res) {
    const data = new Cook({
        _id:mongoose.Types.ObjectId(),
        bio:req.body.bio,
        budget:req.body.budget,
        user:req.body.users
    })
    
    data.save().then((result) => {
        res.json(result)
    }).catch((err) => {
        console.warn(err)
    })
})

app.get('/check',(req,res) => {
    console.warn(req.headers.authorization)
    var t=req.headers.authorization

    if(t) {
        jwt.verify(t,"om",function(err,decode) {
            if(err) {
                console.warn(err)
                res.json({'err':err})
            }
            console.warn(decode)
            res.status(200).send(decode)
            req.user = decode.name
        })
    }
    console.warn(req.user)
})

app.get('/isauth',isAuthenticated,(req,res) => {
    console.warn(req.user)
    res.send({"msg":req.user})
})

app.get('/authuser',isAuthenticated,(req,res) => {
    const data = User.find({name:req.user}).then((result) => {
        res.json({'user':result})
    })
})
app.listen(port, () => console.log(`Example app listening on port port!`))