require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Product = require("../models/Product");

const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Beauty",
    "Sports",
    "Automotive",
    "Toys"
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

const generateProducts = (count) => {
    return Array.from({ length: count }, (_, index) => {
        const price = faker.number.int({
            min: 100,
            max: 5000
        });

        return {
            productName: faker.commerce.productName(),

            sku: `SKU-${faker.string.alphanumeric(10).toUpperCase()}-${index}`,

            category: faker.helpers.arrayElement(categories),

            price,

            cost: faker.number.int({
                min: 50,
                max: price - 1
            }),

            stockQuantity: faker.number.int({
                min: 0,
                max: 1000
            }),

            reorderLevel: faker.number.int({
                min: 10,
                max: 100
            }),

            lastUpdated: faker.date.recent()
        };
    });
};

const seedProducts = async () => {
    try {
        await connectDB();

        console.log("Removing old products...");

        await Product.deleteMany();

        console.log("Generating 50,000 products...");

        const products = generateProducts(50000);

        console.log("Inserting products...");

        await Product.insertMany(products, {
            ordered: false
        });

        console.log("50,000 products inserted successfully");

        process.exit();
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

seedProducts();         