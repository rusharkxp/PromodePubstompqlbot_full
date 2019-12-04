const mongoose = require('mongoose')
const Schema = mongoose.Schema

const feedSchema = new Schema({
    id:{
        type:Number,
        required:true
    },
    message:{
        type:String,
        required: true
    },
    isTook:{
        type:Boolean,
        required:true,
        default:false
    }
})

mongoose.model('feed',feedSchema)