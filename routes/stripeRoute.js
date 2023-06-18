const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');
const { isAdmin,protect } = require('../middleWares/authMiddleware');



router.post('/create-checkout', stripeController.createCheckout);

router.post('/webhook', express.raw({type: 'application/json'}),stripeController.stripeWebhook);

router.post('/create-order', stripeController.createOrder);

module.exports = router;