const express = require("express");
const router = express.Router();

const {
    getProducts,
    searchProducts,
    getAnalytics
} = require("../controllers/productController");

const {
    validateProduct
} = require("../validators/productValidator");

const validateRequest = require("../middleware/validateRequest");

/*
GET ROUTES
*/
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/analytics", getAnalytics);

/*
POST PRODUCT (CREATE)
*/
router.post(
    "/",
    validateProduct,
    validateRequest,
    (req, res) => {
        res.json({
            message: "Product created successfully (mock endpoint)"
        });
    }
);

/*
PUT PRODUCT (UPDATE)
*/
router.put(
    "/:id",
    validateProduct,
    validateRequest,
    (req, res) => {
        res.json({
            message: "Product updated successfully (mock endpoint)"
        });
    }
);

module.exports = router;