const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  title: String,
  message: String,
});

const MessageModel = mongoose.model("message", messageSchema);

module.exports = MessageModel;
