const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true, default: () => `INV-${Date.now()}` }, // Default to a timestamp-based string
  customerName: { type: String, required: true },
  cashierName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  itemDetails: { type: Array, required: true }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
