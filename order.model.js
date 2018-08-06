const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    count:{
        type:Number,
        required:true
    },
    basket:{
        type:String,
        required:true
    },
    height:{
        type:String,
        required:false
    },
    size:{
        type:String,
        required:false
    },
    amount:{
        type:String,
        require:false
    }
})

mongoose.model('order',orderSchema)