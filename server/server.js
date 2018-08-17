const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
 
const app = express()

const mongoose = require('mongoose')
require('dotenv').config()

mongoose.Promise = global.Promise

mongoose.connect(process.env.DATABASE)


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())

//MODELS
const {User} = require('./models/User')


app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)

    user.save( (err, doc) => {
        if(err) {
            return res.json({success:false, err})
        } else {
            res.status(200).json( {
                success: true,
                userdoc: doc,
            })
        } 
    })
})

app.post('/api/users/login', (req, res) => {

    const {email, password} = req.body
    User.findOne({'email':email}, (err, user) => {
        if(!user) {
            return res.json({loginSuccess:false,message:"Auth Failed, email not found"})
        }

        user.comparePassword(password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({loginSuccess:false,message:"Wrong Password"})
            }

            user.generateToken((err, user) => {
                if(err) {
                    return res.status(400)
                }
                res.cookie('w_auth',  user.token).status(200).json({
                    loginSucess:true
                })
            })
        }) 

    })

})

app.post('/api/users/logout', (req, res) => {

})

const port = process.env.PORT || 3002
 
app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
})