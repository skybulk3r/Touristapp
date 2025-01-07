// E:\Rental\routes\orders.js
const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const { verifyToken, verifyAdmin } = require('../middleware/middleware'); // Assuming you have JWT token verification middleware

// Create an order (with Stripe payment integration)
router.post('/create', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id; // Assuming user_id is decoded in the JWT token
    const orderData = req.body;

    // Ensure all necessary order data is provided
    if (!orderData.tour_id || !orderData.total_price) {
      return res.status(400).json({ message: 'Tour ID and total price are required' });
    }

    const { order, clientSecret } = await orderService.createOrder(userId, orderData);
    res.status(201).json({ order, clientSecret }); // Return order data and clientSecret for Stripe frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order details by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all orders (Admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment status (for example, after successful Stripe payment)
router.put('/:id/payment', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body; // paymentStatus is either 'paid' or 'failed'

    // Update the payment status after Stripe payment
    const updatedOrder = await orderService.updatePaymentStatus(orderId, paymentStatus);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
