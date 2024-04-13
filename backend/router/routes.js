const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router()
const genAI = new GoogleGenerativeAI(`${process.env.API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-pro" , fetch});

require("../db/connnection");
const User = require('../model/userSchema');
const authenticate = require('../middleware/authenticate');

router.get('/' , (req,res) => {
    res.send("Backend Home Page");
})

router.get('/viewAllUsers', (req,res) =>{
    User.find()
        .then((users) =>{
            res.send(users)
        })
        .catch((err) => console.log(err))
})

router.get('/currentUser' ,authenticate, (req,res) => {
    return res.status(200).send(req.rootUser)
})

router.get('/checkLoggedUser' , authenticate, (req,res) => {
    if (req.rootUser)
        return res.status(200).json({user: req.rootUser , message: 'User is logged in'})
    else
        return res.status(401).json({message: 'No User Logged in'})
})

router.post('/addPoints',authenticate, (req,res) => {
    const {points} = req.body
    User.updateOne(
        {_id: req.UserID}, 
        {
            points: req.rootUser.points + Number(points),
        }
        )
        .then(()=>{res.status(201).json({message :`Successfully added ${points} to ${req.rootUser.name}`})})
        .catch((e)=>{console.log(e)})
})

router.get('/logout' , (req,res) => {
    res.clearCookie("jwtoken", {path: "/",domain:"http://localhost:5000", httpOnly: true, secure: true, sameSite:"none" });
    res.status(200).json({message:"Logged out Successfully!"})
    console.log(res.cookie)
})

router.post('/gen', authenticate, async (req,res) => {
    const {syllabus, quiz_skel} = req.body;
    const grade = req.rootUser.grade
    console.log(syllabus[grade])
    const prompt = `This is the given syllabus for grade ${grade} ${syllabus[grade]} , create a 15 question quiz such that it covers all the topics that are present in grade ${grade} in this json format given below ${quiz_skel} and provide the question followed by 4 choices in a list and the correct option in form of the choice string`
    const result = await model.generateContent(prompt);
    const response = result.response;
    var text = response.text();
    console.log(text)
    text = text.slice(7, text.length - 3)
    return res.status(200).json({message: JSON.parse(text)})
})

router.post('/ans-analysis',authenticate, async (req,res) => {
    const {questions, wrong_ans, results} = req.body
    const prompt = `these are the questions ${questions} and these are the questions answered wrong ${wrong_ans}, give me the ability score from 1-10 with two decimal places using key ability_score and topics in math which the user is lacking in a list using key lacking_topics and provide the answers in json format.`
    const result = await model.generateContent(prompt);
    const response = result.response;
    var text = response.text();
    console.log(text)
    text = text.slice(7, text.length - 3)
    text = JSON.parse(text)
    User.updateOne(
        { _id: req.UserID },
        { $set: { "lackingTopics": text.lacking_topics } }
      )
        .then(() => {
          console.log('updating lacking topics');
        })
        .catch((e) => {
          console.log(e);
        });
    User.updateOne(
        {_id: req.UserID}, 
        {
            abilityScore: text.ability_score,
            wrongans: results.wrongAnswers,
            rightans: results.correctAnswers,
        }
        )
        .then(()=>{
            return res.status(201).json({message : text, result:`Successfully updated ${req.rootUser.name}'s Results.`})
        })
        .catch((e)=>{console.log(e)})
})


router.post('/register' , (req , res) => {
    const { name , email , pwd , cpwd, grade, role } = req.body
    
    //validation
    function validateEmail(email) {
        const regex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    if(!validateEmail(email)){
        return res.status(401).json({message: "Invalid Email"})
    }

    //Checking existing User
    User.findOne({email: email})
        .then( (userExist) => {
            if(userExist){
                return res.status(401).json({message: "Email already Exists"})
            }

            else if(pwd != cpwd){
                return res.status(401).json({message: "Confirm Password not equal"})
            }

            const user = new User({name , email, pwd, cpwd, grade, role})
            
            user.save().then(() => {
                res.status(201).json({message: "User registered Succesfully"})
            }).catch((e) => res.status(500).json({message: "Failed to register"}))
            
        })
        .catch( e => { console.log(e) })
})

router.post('/login' , (req , res) => {
    const { email , pwd } = req.body 
    // console.log(req.body)

    //validation
    function validateEmail(email) {
        const regex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }
    if(!email || !pwd){
        return res.status(401).json({error : "Please fill all the fields!"})
    }
    if(!validateEmail(email)){
        return res.status(401).json({error: "Invalid Email"})
    }

    //Checking existing User
    User.findOne({email : email})
        .then(async (userExist) => {      //userExist contains details of the found user or NULL value
            if(userExist){
                bcrypt.compare( pwd , userExist.pwd)
                    .then((isMatch) =>{
                        if(!isMatch)
                            res.status(401).json({message: "Wrong Password"})
                        else
                            res.status(200).json({message: "Login Successfull", role: userExist.role})
                    }).catch(e => console.log(e))

                const token = await userExist.generateAuthToken();
                console.log(token)
                
                //cookie
                res.cookie("jwtoken" , token , { 
                    expires: new Date(Date.now() + 3600000),
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                });
            }
            else
                res.status(401).json({message: "Couldnt find the User"})
        })
        .catch((e) => {
            console.log(e)
        })
})


module.exports = router
