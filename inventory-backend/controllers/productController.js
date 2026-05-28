const Product = require("../models/Product");

/*
========================================
GET PRODUCTS WITH PAGINATION
========================================
GET /api/products?page=1&limit=50
========================================
*/
exports.getProducts = async (req, res) => {
  try {
    
    // Current Page
    const page = parseInt(req.query.page) || 1;

    // Records Per Page
    const limit = parseInt(req.query.limit) || 50;

    // Skip Calculation
    const skip = (page - 1) * limit;

    /*
    FETCH PRODUCTS
    Using:
    - Pagination
    - Lean Query Optimization
    */
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    // Total Products Count
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,

      currentPage: page,

      totalPages: Math.ceil(totalProducts / limit),

      totalProducts,

      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

/*
========================================
FULL TEXT SEARCH
========================================
GET /api/products/search?q=wireless
========================================
*/
exports.searchProducts = async (req, res) => {
  try {
    // Search Query
    const query = req.query.q;

    // Validation
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    /*
    TEXT SEARCH
    Uses MongoDB text index
    */
    const results = await Product.find({
      $text: {
        $search: query
      }
    })
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      totalResults: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message
    });
  }
};

/*
========================================
ANALYTICS AGGREGATION
========================================
GET /api/products/analytics
========================================
*/
exports.getAnalytics = async (req, res) => {
  try {
    /*
    AGGREGATION PIPELINE
    */
    const analytics = await Product.aggregate([
      {
        $group: {
          _id: "$category",

          totalProducts: {
            $sum: 1
          },

          averagePrice: {
            $avg: "$price"
          },

          totalStock: {
            $sum: "$stockQuantity"
          },

          totalInventoryValue: {
            $sum: {
              $multiply: ["$price", "$stockQuantity"]
            }
          }
        }
      },

      {
        $sort: {
          totalProducts: -1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Analytics fetch failed",
      error: error.message
    });
  }
};
