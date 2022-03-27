
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    deliver_time:{type:Date,required: true},
    arrival:{type:Boolean,required:false,default:false}
},{
    versionKey:false,
    timestamps:true
});

module.exports = mongoose.model("product",productSchema);