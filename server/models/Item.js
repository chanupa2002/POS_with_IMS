const mongoose = require('mongoose');

// Define the schema for an item
const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Ensuring name is required
    },
    description: {
        type: String,
        required: true,  // Item description
    },
    price: {
        type: Number,
        required: true,  // Item price
    },
    quantity: {
        type: Number,
        required: true,  // Quantity in stock
        default: 0,  // Default quantity is 0 if not provided
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Timestamp when the item is created
    },
});

// Create and export the Item model
const ItemModel = mongoose.model("items", ItemSchema);

module.exports = ItemModel;
