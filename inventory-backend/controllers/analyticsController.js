const Product = require("../models/Product");

/*
HEAVY AGGREGATION PIPELINE
*/
exports.getAnalytics = async (req, res) => {
    try {
        const { category } = req.query;

        /*
        1. MATCH STAGE (FILTER DATA EARLY)
        */
        const matchStage = {};

        if (category) {
            matchStage.category = category;
        }

        /*
        2. AGGREGATION PIPELINE
        */
        const data = await Product.aggregate([
            {
                // FILTER FIRST (IMPORTANT FOR PERFORMANCE)
                $match: matchStage
            },

            {
                // GROUP BY CATEGORY
                $group: {
                    _id: "$category",

                    totalProducts: {
                        $sum: 1
                    },

                    totalStock: {
                        $sum: "$stockQuantity"
                    },

                    totalCostValue: {
                        $sum: {
                            $multiply: ["$cost", "$stockQuantity"]
                        }
                    },

                    totalSellingValue: {
                        $sum: {
                            $multiply: ["$price", "$stockQuantity"]
                        }
                    },

                    avgPrice: {
                        $avg: "$price"
                    }
                }
            },

            {
                /*
                3. PROJECT (FORMAT OUTPUT FOR FRONTEND CHARTS)
                */
                $project: {
                    _id: 0,

                    category: "$_id",

                    totalProducts: 1,

                    totalStock: 1,

                    totalCostValue: 1,

                    totalSellingValue: 1,

                    profitPotential: {
                        $subtract: ["$totalSellingValue", "$totalCostValue"]
                    },

                    avgPrice: 1
                }
            }
        ]);

        /*
        4. RESPONSE
        */
        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};