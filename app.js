require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(express.json());

// Import Models
const Products = require("./models/Products");

// Import Encryption Utils
const { encrypt, decrypt } = require("./utils/encryption");

// Import Routes
const userRoutes = require("./routes/UserRoute");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connection Open"))
.catch(err => console.log("Error in MongoDB Connection", err));


// USER ROUTES
app.use("/api/users", userRoutes);


// POST: Add product (Postman API)
app.post("/add-p-api", async (req, res) => {
  try {

    const encryptedName = encrypt(String(req.body.product_name));

    const data = await Products.create({
      product_name: encryptedName,
      product_details: req.body.product_details,
      product_price: req.body.product_price
    });

    res.json({
      msg: "Product Added (Encrypted)",
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/display-p-api", async (req, res) => {
  try {

    const pdata = await Products.find();

    const decryptedData = pdata.map(item => {

      let name = item.product_name;

      // decrypt only if encrypted
      if (name && name.includes(":")) {
        try {
          name = decrypt(name);
        } catch {
          name = item.product_name;
        }
      }

      return {
        _id: item._id,
        product_name: name,
        product_details: item.product_details,
        product_price: item.product_price,
        created: item.created
      };

    });

    res.json(decryptedData);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Browser Test (Add Product)
app.get('/add-product', async (req, res) => {
  try {

    const userData = {
      product_name: encrypt("iPhone"),
      product_details: "Best Phone",
      product_price: 85000
    };

    await Products.create(userData);

    res.send("RECORD ADDED (Encrypted)");

  } catch (err) {
    res.status(500).send("Error Record Add");
  }
});


// Browser Test (Display Products)
app.get('/display-p', async (req, res) => {
  try {

    const mydata = await Products.find();

    const decryptedData = mydata.map(item => ({
      ...item._doc,
      product_name: decrypt(item.product_name)
    }));

    res.send(decryptedData);

  } catch (err) {
    res.status(500).send("Fetch Error");
  }
});


// Default Route
app.get('/', (req, res) => {
  res.send("MongoDB + Node.js API Running");
});


// Server Start
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
