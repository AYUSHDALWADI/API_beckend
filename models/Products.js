const mongoose = require('mongoose')
const { create } = require('node:domain')
const { type } = require('node:os')

const ProductSchema = new mongoose.Schema({
  product_name: String,
  product_details: String,
  product_price: Number,
  created:{
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Product',ProductSchema);