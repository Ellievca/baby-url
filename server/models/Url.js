const mongoose = require('mongoose');

const babyurlSchema = new mongoose.Schema({
    bigUrl:     { type:String, required:true},
    babyCode:   { type:String, required:true, unique:true },
    alias:      { type:String, unique:true, sparse:true },
    owner:      { type:mongoose.Schema.Types.ObjectId, ref:'User', default:null },
    expiresAt:  { type:Date, default:null },
    clickCount: { type:Number, default:0 },
}, { timestamps:true }); // adds createdAt and updatedAt fields

module.exports = mongoose.model('Url', babyurlSchema);