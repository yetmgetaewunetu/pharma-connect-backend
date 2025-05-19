const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    pharmacy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy',
        required: true,
    },
    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    expiryDate: {
        type: Date,
        required: true,  
    },
    price: {
        type: Number,
        required: true,  
        min: 0,  
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

InventorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Inventory = mongoose.model('Inventory', InventorySchema);

module.exports = Inventory;
