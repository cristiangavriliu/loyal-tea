import mongoose from 'mongoose';

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    allergens: {
        type: [String],  // Define an array of strings for allergens
        required: false  // Not required, as some items may not have allergens
    },
    id: {
        type: Number,
        required: true,
        unique: true,
        default: function() {
            return Date.now();
        }
    },
    imageLink: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Alcoholics', 'Non-Alcoholics', 'Food', 'Snacks', 'internal'],
    },
    }

);

export const Item = mongoose.model('Item', itemSchema);

