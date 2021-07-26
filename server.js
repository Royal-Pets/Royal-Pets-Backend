"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const server = express();
server.use(cors());

server.use(express.json());
const PORT = process.env.PORT || 3002;

const mongoose = require("mongoose");
mongoose.connect(
  `mongodb://${process.env.DB_CONF}@cluster0-shard-00-00.uvjqt.mongodb.net:27017,cluster0-shard-00-01.uvjqt.mongodb.net:27017,cluster0-shard-00-02.uvjqt.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-h1qilz-shard-0&authSource=admin&retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const messageModel = require("./MessageSchema.js");
const adoptModel = require("./AdoptSchema.js");

// function seedUserCollection() {
//   const omar = new messageModel({
//     sender: "xxx",
//     receiver: "sss",
//     title: "title",
//     message: "message",
//   });

//   omar.save();
// }
// seedUserCollection();

server.get("/adoptList", (req, res) => {
  adoptModel.find({}, (error, adoptData) => {
    if (error) {
      res.send("cant find user");
    } else {
      res.send(adoptData);
    }
  });
});

server.get("/userAdoptList", (req, res) => {
  adoptModel.find({ email: req.query.email }, (error, adoptData) => {
    if (error) {
      res.send("cant find user");
    } else {
      res.send(adoptData);
    }
  });
});

server.get("/messages", messagesHandler);

function messagesHandler(req, res) {
  messageModel
    .find()
    .or([{ sender: req.query.email }, { receiver: req.query.email }])
    .then((messageData) => {
      res.send(messageData);
    })
    .catch((error) => res.send("NOT FOUND"));
}

server.post("/addmessage", addmessageHandler);

function addmessageHandler(req, res) {
  messageModel.find({}, (error, messagesData) => {
    if (error) {
      res.send("cant find user");
    } else {
      let newMessage = new messageModel(req.body);
      messagesData.push(newMessage);
      newMessage.save();
      res.send(messagesData);
    }
  });
}

server.post("/addAdopt", addAdoptHandler);

function addAdoptHandler(req, res) {
  adoptModel.find({}, (error, adoptData) => {
    if (error) {
      res.send("cant find user");
    } else {
      let adopt = new adoptModel(req.body);
      adoptData.push(adopt);
      adopt.save();
      res.send(adoptData);
    }
  });
}

server.listen(PORT, () => console.log(`listening on ${PORT}`));
