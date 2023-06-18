const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
   name:{
    type: String,
    required: true
   },
   quantity:{
    type: Number,
    required: true
   },
   brand:{
    type: String,
    required: true
   },
   desc:{
    type: String,
    required: true
   },
   category:{
    type: String,
    required: true
   },
   price:{
    type: Number,
    required: true
   },
   image:{
    type: Object,
    required: true
   },
},{
    timestamps: true
});


module.exports = mongoose.model('Prodcuts', productSchema);