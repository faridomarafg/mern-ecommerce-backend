const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAdmin,protect } = require('../middleWares/authMiddleware');

router.get('/', orderController.getOrders);
router.get('/user-order/:id', protect,orderController.getOrderByUser);
router.get('/:id', orderController.getOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;