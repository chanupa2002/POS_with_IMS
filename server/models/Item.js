const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  
    },
    description: {
        type: String,
        required: true,  
    },
    price: {
        type: Number,
        required: true, 
    },
    quantity: {
        type: Number,
        required: true,  
        default: 0, 
    },
    createdAt: {
        type: Date,
        default: Date.now,  
    },
});

const ItemModel = mongoose.model("items", ItemSchema);

module.exports = ItemModel;
