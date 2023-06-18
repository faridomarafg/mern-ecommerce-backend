const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
   userId:{type: String, required: true},//currently logged userId
   customerId:{type: String},//this the userId from stripe;
   paymentIntent:{type: String},
   products:[], 
   subtotal:{type:Number, required:true},//without shipping taxes
   total:{type:Number},//with shipping taxes
   shipping:{type:Object, required:true},//this is shipping address
   delivery_status: {type: String, default:'Pending'},
   payment_status: { type: String, required: true }, 
},{
    timestamps: true
});


module.exports = mongoose.model('Order', orderSchema);