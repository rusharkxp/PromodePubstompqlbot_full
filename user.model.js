const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    id:{
        type:Number,
        required:true
    },
    isAdmin:{
        type: Boolean,
        required:true,
        default:false
    },
    username:{
        type: String,
        required:true
    }
})

mongoose.model('user',userSchema)