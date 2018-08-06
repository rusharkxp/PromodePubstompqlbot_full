const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    id:{
        type:Number,
        required:true
    }
})

mongoose.model('user',userSchema)