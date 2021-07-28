const mongoose = require("mongoose");

const adoptSchema = new mongoose.Schema({
  pet: String,
  owner: String,
  email: String,
  age: String,
  bread: String,
  description: String,
  img_url: String,
});

const AdoptModel = mongoose.model("adopt", adoptSchema);

module.exports = AdoptModel;
