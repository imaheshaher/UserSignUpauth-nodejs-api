 const express =require("express")
 const app = express()

 const mongoose = require("mongoose")
 const bodyParser = require("body-parser")
 const jsonParser = bodyParser.json()
 

 const {User,Cook} = require("../models/cook")
 require("../models/db")

 const bcrypt = require("bcrypt")
 const jwt = require("jsonwebtoken")
 const { Router } = require("express")
 const router = Router()


 function isAuthenticated(req,res,next) {
    
    var t = req.headers.authorization
    console.warn(t)
    jwt.verify(t,"om",(err,decode) => {
        if(err) {
            res.json({'err':err})
        }
        req.user = decode.email
    })
    if(req.user) {
        try {
            u = User.findOne({email:req.user,token:t}).then(result =>{
                if(result ) {
                    return next()
                }
            })
        } catch (error) {
            res.json("Something wrong")    
        }
        
    }
    else {
        console.warn("Not authenticate")
    }
}
 router.post('/register',jsonParser, (req,res) => {
     const email = req.body.email
     let p = bcrypt.hashSync(req.body.password,10)
     user = User.findOne({email}).exec().then(result => {
            if(result) {
                res.json("Already taken")
            }
            else {
                const data = new User({
                    _id:mongoose.Types.ObjectId(),
                    name:req.body.name,
                    email:req.body.email,
                    address : req.body.address,
                    token:1,
                    password:p
                })
                data.save().then(u => {
                    res.json(u)
                })
            }
         })
    
 })
 
 router.get('/getusers',(req,res) => {
     

     const data = User.find({}).then((result) => {
         res.json(result)
     })
 })


 router.post('/loginuser',jsonParser,(req,res) => {
    const email = req.body.email
    const password = req.body.password
    
    let user = User.findOne({email}).exec().then(result => {
        if(result ){
            let p = bcrypt.hashSync(password,result.password)
            if(result.password == p ) {
                var token = jwt.sign({
                    email:email
                },"om")
                if(token) {
                    req.headers.authorization=token
                    User.updateOne({email},{$set:{token:token}},(err,result) =>
                    {
                        console.warn(result)
                        res.json(token)
                    })
                }
            }
            else {
                res.json("Does not exist")
            }
        }
        else {
            res.json("User Not found")
        }
    })
 })
 router.get('/check',isAuthenticated,(req,res) => {
     res.json({"auth":req.user})

 })

 router.get('/logoutuser',isAuthenticated,(req,res) => {
    
    let user = User.findOne({email:req.user}).exec().then( result => {
        if(result ){
            User.updateOne({email:req.user},{$set:{token:1}},(err,success ) => {
                if(success) {
                    res.json("Logged Out")
                }
                else {
                    res.json(err)
                }
            })
        }
    })
 })

 app.listen(3000)
 app.use('/api',router)