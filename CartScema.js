const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productName: String,
  itsFor: String,
  Price: String,
  image: String,
});

const UserCartSchema = new mongoose.Schema({
  email: String,
  products: [cartSchema],
});

const CartModel = mongoose.model("cart", UserCartSchema);

module.exports = CartModel;
