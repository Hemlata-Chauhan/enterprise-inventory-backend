const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            index: true
        },

        category: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        cost: {
            type: Number,
            required: true,
            min: 0
        },

        stockQuantity: {
            type: Number,
            required: true,
            min: 0
        },

        reorderLevel: {
            type: Number,
            required: true,
            min: 0
        },

        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

/*
Compound indexes for optimized queries
*/

//productSchema.index({ category: 1 });

productSchema.index({ productName: "text" });

//productSchema.index({ sku: 1 });
productSchema.index({ category: 1, price: 1 });
module.exports = mongoose.model("Product", productSchema);