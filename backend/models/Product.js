
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    supplier: { type: String },
});

module.exports = mongoose.model('Product', productSchema);
