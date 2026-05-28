const { body } = require("express-validator");

/*
COMMON VALIDATION RULES
*/
exports.validateProduct = [
  body("productName")
    .notEmpty()
    .withMessage("Product name is required"),

  body("sku")
    .notEmpty()
    .withMessage("SKU is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("price")
    .isNumeric()
    .withMessage("Price must be numeric"),

  body("cost")
    .isNumeric()
    .withMessage("Cost must be numeric"),

  body("stockQuantity")
    .isNumeric()
    .withMessage("Stock quantity must be numeric"),

  body("reorderLevel")
    .isNumeric()
    .withMessage("Reorder level must be numeric"),

  /*
  BUSINESS RULE 1:
  price must be >= cost
  */
  body("price").custom((value, { req }) => {
    if (Number(value) < Number(req.body.cost)) {
      throw new Error("Price cannot be lower than cost");
    }
    return true;
  }),

  /*
  BUSINESS RULE 2:
  stockQuantity cannot be negative
  */
  body("stockQuantity").custom((value) => {
    if (Number(value) < 0) {
      throw new Error("Stock quantity cannot be negative");
    }
    return true;
  })
];