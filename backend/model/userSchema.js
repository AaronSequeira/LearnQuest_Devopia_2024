const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config({path: '../config.env'})

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    pwd:{
        type: String,
        required: true
    },
    cpwd:{
        type: String,
        required: true
    },
    grade:{
        type: String,
        required:true,
    },
    role:{
        type: String,
        required: true
    },
    abilityScore:{
        type: Number,
        default: 0,
    },
    lackingTopics:{
        lackingTopics: {
            type: [String],
            default: ["", "", "", "", ""]
          }
    },
    wrongans:{
        type: Number,
        default: 0,
    },
    rightans:{
        type: Number,
        default: 0,
    },
    pred:{
        type: Number,
        default: 0,
    },
    tokens:[
        {
            token:{
                type: String,
                required: true
            }
        }
    ],
})

userSchema.pre('save', async function(next) {
    // console.log("Inside pre-save")
    if(this.isModified('pwd')){               //this references instance 'userSchema'
        this.pwd = await bcrypt.hash(this.pwd , 12)
        this.cpwd = await bcrypt.hash(this.pwd , 12)
    }
    next()
})

//token generation
userSchema.methods.generateAuthToken = async function() {
    const newToken = jwt.sign({_id : this._id}, process.env.SECRET_KEY)
    this.tokens = this.tokens.concat({token : newToken})
    this.save();
    return newToken;
}

const User = mongoose.model('USER' , userSchema)

module.exports = User

