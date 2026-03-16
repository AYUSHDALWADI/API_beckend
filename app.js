require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

// JSON Middleware
app.use(express.json());

// Import Models
const Products = require("./models/Products");

// Import Routes
const userRoutes = require("./routes/UserRoute");

// =======================
// MongoDB Connection
// =======================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connection Open"))
.catch(err => console.log("Error in MongoDB Connection", err));


// =======================
// USER ROUTES
// =======================
app.use("/api/users", userRoutes);


// =======================
// POST: Add product (Postman)
// =======================
app.post('/add-p-api', async (req, res) => {
  try {
    const data = await Products.create(req.body);
    res.json({ flag: 1, msg: 'Product Added', data });
  } catch (err) {
    res.status(500).json({ flag: 0, error: err.message });
  }
});


// =======================
// GET: Display products (API)
// =======================
app.get('/display-p-api', async (req, res) => {
  try {
    const pdata = await Products.find();
    res.json(pdata);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// Browser Test (Add Product)
// =======================
app.get('/add-product', async (req, res) => {
  try {
    const userData = {
      product_name: "iPhone",
      product_details: "Best Phone",
      product_price: 85000
    };

    await Products.create(userData);
    res.send("RECORD ADDED");
  } catch (err) {
    res.status(500).send("Error Record Add");
  }
});


// =======================
// Browser Test (Display Products)
// =======================
app.get('/display-p', async (req, res) => {
  try {
    const mydata = await Products.find();
    res.send(mydata);
  } catch (err) {
    res.status(500).send("Fetch Error");
  }
});


// =======================
app.get('/', (req, res) => {
  res.send("MongoDB and API Running");
});


// =======================
// Server Start
// =======================
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});