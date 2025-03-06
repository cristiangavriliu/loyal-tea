import express from "express";
import { Order } from "../models/orderModel.js";
import { isAuthenticated, isEmployee } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes

router.post("/create", isAuthenticated, createOrder);
router.get("/getAll", isAuthenticated, isEmployee, getAllOrders);
router.get("/get/:id", getByID);
router.get("/getByUser/:userId", isAuthenticated, getOrdersByUser); // New route to get orders by user ID
router.put("/update/:id", updateOrder);
router.put('/confirm', confirmOrder);
router.delete("/delete/:id", deleteOrder);

// Methods

// Create order
async function createOrder(req, res) {
    try {
        // Count documents and add incremental ID to the new order
        await Order.countDocuments({}).then(async count => {
            let order = req.body;
            order.id = count + 1;
            let newOrder = new Order(order);
            let result = await newOrder.save();
            return res.status(201).send(result);
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Get all orders
async function getAllOrders(req, res) {
    try {
        let orders = await Order.find().populate({
            path:     'items',		//the path in the order data model	
            populate: { path:  'item', //within items whe have item and quantity, we select quantity
                    model: 'Item' } //the mongoos schema
          }).populate('user'); // Populate the items and user fields
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Get an order by ID
async function getByID(req, res) {
    try {
        let order = await Order.findById(req.params.id)
        .populate({
            path:     'items',		//the path in the order data model	
            populate: { path:  'item', //within items whe have item and quantity, we select quantity
                    model: 'Item' } //obv
          })
            .populate('user'); // Populate the items and user fields
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Get orders by user ID
async function getOrdersByUser(req, res) {
    try {
        let orders = await Order.find({ user: req.params.userId })
        .populate({
            path:     'items',		//the path in the order data model	
            populate: { path:  'item', //within items whe have item and quantity, we select quantity
                    model: 'Item' } //obv
          })
            .populate('user'); // Populate the items and user fields
        if (!orders) {
            return res.status(404).send({ message: "Orders not found" });
        }
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Update an order
async function updateOrder(req, res) {
    try {
        let order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate({
            path:     'items',		//the path in the order data model	
            populate: { path:  'item', //within items whe have item and quantity, we select quantity
                    model: 'Item' } //obv
          })
            .populate('user'); // Populate the items and user fields
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Delete an order
async function deleteOrder(req, res) {
    try {
        await Order.findByIdAndDelete(req.params.id);
        return res.status(200);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Confirm payment for order
async function confirmOrder(req, res) {
    try {
        await Order.findOneAndUpdate({ _id: req.body.orderId }, { status: 'Ordered' }, { new: true });
        return res.status(200);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}


export default router;


