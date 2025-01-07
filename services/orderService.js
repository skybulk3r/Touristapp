// E:\Rental\services\orderService.js
const { Order, User, Tour } = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key from .env

// Create an order
const createOrder = async (userId, orderData) => {
  try {
    // Create the order in the database first
    const newOrder = await Order.create({
      user_id: userId,
      tour_id: orderData.tour_id,
      total_price: orderData.total_price,
      payment_status: 'pending',
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(orderData.total_price * 100), // Stripe expects the amount in cents
      currency: 'usd', // Change this to the relevant currency
      metadata: { order_id: newOrder.order_id },
    });

    // Update the order with the Stripe payment intent ID
    newOrder.stripe_payment_id = paymentIntent.id;
    await newOrder.save();

    return { order: newOrder, clientSecret: paymentIntent.client_secret }; // Return order data and client secret for frontend
  } catch (error) {
    throw new Error('Error creating order: ' + error.message);
  }
};

// Get an order by ID
const getOrderById = async (orderId) => {
  try {
    const order = await Order.findOne({
      where: { order_id: orderId },
      include: [User, Tour],
    });
    return order;
  } catch (error) {
    throw new Error('Error fetching order: ' + error.message);
  }
};

// Get all orders (Admin only)
const getAllOrders = async () => {
  try {
    const orders = await Order.findAll({
      include: [User, Tour], // Include related user and tour data
    });
    return orders;
  } catch (error) {
    throw new Error('Error fetching orders: ' + error.message);
  }
};

// Update payment status after successful payment (called by Stripe webhook)
const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const order = await Order.findOne({ where: { order_id: orderId } });

    if (order) {
      order.payment_status = paymentStatus;
      await order.save();
      return order;
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    throw new Error('Error updating payment status: ' + error.message);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updatePaymentStatus,
};
