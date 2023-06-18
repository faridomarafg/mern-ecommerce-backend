require('dotenv').config();
const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');

//GET ALL ORDERS
const getOrders = async(req, res)=>{
   const orders = await Order.find().sort({date: -1});
   if(!orders?.length) res.status(400).json({message:'No order is available for now!'});
   res.status(200).json(orders);
};

//GET ORDER BY ID
const getOrder = async(req, res)=>{
  const order = await Order.findById(req.params.id);
  if(!order) res.status(400).json({message:'Order not found!'});
  res.status(200).json(order);
};


//Get orderByUser
const getOrderByUser = asyncHandler(async (req, res)=>{
  //find user id to get order by that
  const {id} = req.params;
  
  const order = await Order.find({userId: id});
  res.status(200).json(order);
});

//UPDATE ORDER
const updateOrder = async (req, res) => {
  const id = req.params.id;
  
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { ...req.body }, { new: true });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//DELETE ORDER
const deleteOrder = async (req, res) => {
  const id = req.params.id;

  try {
    await Order.findByIdAndDelete(id);
    res.send('order deleted successfully!')
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrderByUser
}





















// require('dotenv').config();
// const Order = require('../models/orderModel');
// const { v4 : uuidv4 } = require('uuid');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// //CREATE ORDER
// const createOrder = async(req, res)=>{
//    //console.log('console_log_body: ',req.body); 
//    const {userId,totalAmount,cart, token} = req.body;

//    try {
//      const customer = await stripe.customers.create({
//         email: token.email,
//         source: token.id,//we get all these value from token.id, it not _id, its just [id];
//      });

//      //now we should charge it;
//      const payment = await stripe.paymentIntents.create(
//      {
//       amount:totalAmount * 100,
//       customer: customer.id,
//       currency: 'usd',
//       receipt_email: token.email   ,
//       payment_method_types: ['card'],
//       metadata: {
//         order_id: token.id,
//       },
//      },
//      {
//         idempotencyKey: uuidv4(),
//       }
//      );

//      res.send('Payment successfull')
//      console.log(payment);

//      if(payment){
        // const newOrder = await Order.create({
        //   userId,
        //   customerId: customer.id,
        //   products: cart,
        //   total: totalAmount
        // })

//         await newOrder.save();
//         return res.status(200).send('Order created successfully')
//      }

     

//    } catch (error) {
//      console.log(error);
//    }

// };


// module.exports = {
//     createOrder
// }








// const Order = require('../models/orderModel');


// //CREATE ORDER
// const createOrder = async(customer, data, lineItems)=>{
   
// //now let's create newOrder
// const newOrder = await new Order({
//     userId: customer.metadata.userId,
//     customerId: data.customer,
//     paymentIntentId: data.payment_intent,
//     products: lineItems.data,
//     subtotal: data.amount_subtotal,
//     total: data.amount_total,
//     shipping: data.customer_details,
//     payment_status: data.payment_status,
// });

// try {
//     const savedOrder = await newOrder.save();
//     console.log('Processed Order :', savedOrder);
// } catch (error) {
//     console.log(error);
// }
// };


// module.exports = {
//     createOrder
// }