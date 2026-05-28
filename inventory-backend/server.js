require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

/*
  DATABASE CONNECTION
*/
connectDB();

/*
  MIDDLEWARE
*/
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

/*
  ROUTES
*/
app.use("/api/products", productRoutes);

/*
  ANALYTICS ROUTES
*/
app.use("/api/analytics", analyticsRoutes);

/*
  HOME ROUTE
*/
app.get("/", (req, res) => {
    res.send("Inventory Backend Running");
});

/*
  ERROR HANDLER
*/
app.use(errorHandler);

/*
  SERVER
*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
