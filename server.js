require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dbConnect = require('./config/dbConnect');
const products = require('./product');


const PORT = process.env.PORT || 3500;

//MONGO DB CONNECTION
dbConnect();

app.use(
  cors({
    origin: ["http://localhost:3000", 'https://mern-stack-blog-v1-frontend.onrender.com'],
    credentials: true,
  })
);

// app.use(
//   bodyParser.json({
//     verify: function(req, res, buf) {
//       req.rawBody = buf;
//     }
//   })
// );
app.use(
  bodyParser.json({
    verify: function(req, res, buf) {
      req.rawBody = buf;
    },
    limit: '30mb' // Set the maximum file size to 10MB
  })
);

//Middle wares
app.use(bodyParser.json({limit:'30mb', extended: true}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({limit:'30mb', extended: true}));



app.use("/localhost:3500/api/stripe/webhook", express.raw({ type: "*/*" }));
app.use(express.json());

app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});


//Routes
 app.use('/api/users', require('./routes/userRoutes'));
 app.use('/api/products', require('./routes/productRoutes'));
 app.use('/api/stripe', require('./routes/stripeRoute'));
 app.use('/api/category', require('./routes/categoryRoutes'));
 app.use('/api/order', require('./routes/orderRoutes'));
 
app.get('/products', (req, res)=>{
    res.send(products)
})


app.listen(PORT, ()=>{
    console.log(`app is running on Port ${PORT}`);
})