const mongoose = require('mongoose');


const recordSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
        min:0,
    },
    type:{
        type:String,
        enum:['income','expense'],
        required:true,
    },
    category:{
        type:String,
        required:true,
        trim:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    description:{
        type:String,
        trim:true,
        maxlength:200,
    },
    belongsTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true});



module.exports = mongoose.model('Record',recordSchema);