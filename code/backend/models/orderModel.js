import mongoose from 'mongoose';

// Define a subdocument schema for items
const quantityItemSchema = mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'item',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

// Define the order schema
const orderSchema = mongoose.Schema({
    items: {
        type: [quantityItemSchema], // Use the item schema as a subdocument
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Ordered', 'In Progress', 'Completed', 'Pending'],
        default: 'Pending'
    },
    table: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: true,
    }
});

const Order = mongoose.model('Order', orderSchema);

export { Order };