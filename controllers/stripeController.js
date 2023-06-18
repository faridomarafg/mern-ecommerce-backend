const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');

//CRETE CHECK OUT;
const createCheckout = async (req, res) => {
    //Note: once we proced this checkout-session, a customer will create automatically by strip, so we can expand the details of that custormer in [metadata];

    //so lets expand the details of customer by creeating a customer;
    const customer = await stripe.customers.create({
        metadata:{
            userId: req.body.userId,
            //cart: JSON.stringify(req.body.cartItems)
        },
    });

     const line_items = req.body.cartItems.map((item)=>{
      return{
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images:[item.image.url],
            metadata:{
              id: item._id
            }
          },
          unit_amount: item.price,
        },
        quantity: item.cartQuantity,
      }
    });
  
    const session = await stripe.checkout.sessions.create({
  
      //ADD SHIPPING ADDRESS
      payment_method_types:['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'IN','AF',],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd',
            },
            display_name: 'Next day air',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 1,
              },
            },
          },
        },
      ],
      // ADD PHONE NUMBER
      phone_number_collection: {
        enabled: true,
      },
      customer: customer.id,
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout-success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    }); 
  
    res.send({url:session.url});
};

//CREATE ORDER FUNCTION
const createOrder = async(customer, data,lineItems)=>{

    const newOrder = new Order({
        userId: customer.metadata.userId,
        customerId: data.customer,// this come from [customer: customer.id,] here;
        paymentIntent: data.payment_intent,
        products:lineItems.data,
        subtotal: data.amount_subtotal,
        total: data.amount_total,
        shipping: data.customer_details,
        payment_status: data.payment_status
    });

    try {
        const savedOrder = await newOrder.save();
        console.log('Processed Order :', savedOrder);
    } catch (error) {
        console.log(error);
    }
};


// STRIPE WEB-HOOK
const endpointSecret = process.env.ENDPOINT_SECRET;

const stripeWebhook = (req, res) => {
    const sig = req.headers['stripe-signature'];
    let data;
    let eventType;
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  
    // Handle the event
    if(eventType === 'checkout.session.completed'){
      //for getting customer from stripe
      stripe.customers.retrieve(data.customer)//this is the id of customer which come from [ customer: customer.id]
      .then((customer)=>{
        stripe.checkout.sessions.listLineItems(
            data.id,
            {},
            function(err, lineItems) {
              console.log('line_items', lineItems);
              createOrder(customer, data, lineItems);// call the createOrder-function here
            }
          );
      })
      .catch((err)=> console.log(err.message))
    }
  
    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }

module.exports ={
    createCheckout,
    stripeWebhook,
    createOrder 
}