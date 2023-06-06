const mongoose = require('mongoose')
const Schema = mongoose.Schema
const user_Data = new Schema({
    username:{
        type: String,
    },
    symptom:{
        type: String,
    },
    date:{
        type: String
    }
}, { collection : 'userData' })
module.exports = mongoose.model('userData', user_Data)  // userData no use