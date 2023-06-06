const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type: String,
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
    },
    phone:{
        type: String
    }
}, { collection : 'User' })


module.exports = mongoose.model('User', userSchema)

