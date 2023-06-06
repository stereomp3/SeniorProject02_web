const mongoose = require('mongoose')
const Schema = mongoose.Schema
// the dataset is built by rasa server
const AIinqury = new Schema({  // in AI inqury
    username:{
        type: String,
    },
    date:{
        type: String
    },
    message:{
        type: String
    },
    symptom:{
        type: String
    },
    
}, { collection : 'ai_inqury' })
module.exports = mongoose.model('ai_inqury', AIinqury)