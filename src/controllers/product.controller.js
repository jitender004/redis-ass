
const express = require("express");

const router = express.Router();
const client = require("../configs/redis");
const Product = require("../models/product.model");

router.post("",async (req,res) => {
 try{
  const product = await Product.create(req.body);

  const products = await Product.find().lean().exec();

  client.set("products", JSON.stringify(products));

  return res.status(201).send(product);
 }catch(err){
     return res.status(400).send(err.message);
 }
});

router.get("", async (req, res) => {
    try {
      client.get("products", async function (err, fetchedTodos) {
        if (fetchedTodos) {
          const products = JSON.parse(fetchedTodos);
  
          return res.status(200).send({ products, redis: true });
        } else {
          try {
            const products = await Product.find().lean().exec();
  
            client.set("products", JSON.stringify(products));
  
            return res.status(200).send({ products, redis: false });
          } catch (err) {
            return res.status(500).send({ message: err.message });
          }
        }
      });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  
  router.get("/:id", async (req, res) => {
    try {
      client.get(`products.${req.params.id}`, async function (err, fetchedTodo) {
        if (fetchedTodo) {
          const prob = JSON.parse(fetchedTodo);
  
          return res.status(200).send({ prob, redis: true });
        } else {
          try {
            const prob = await Product.findById(req.params.id).lean().exec();
  
            client.set(`todos.${req.params.id}`, JSON.stringify(prob));
  
            return res.status(200).send({prob, redis: false });
          } catch (err) {
            return res.status(500).send({ message: err.message });
          }
        }
      });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  
  router.patch("/:id", async (req, res) => {
    try {
      const prob = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .lean()
        .exec();
  
      const products = await Product.find().lean().exec();
  
      client.set(`products.${req.params.id}`, JSON.stringify(prob));
      client.set("products", JSON.stringify(products));
  
      return res.status(200).send(prob);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  
  router.delete("/:id", async (req, res) => {
    try {
      const prob = await Product.findByIdAndDelete(req.params.id).lean().exec();
  
      const products = await Product.find().lean().exec();
  
      client.del(`products.${req.params.id}`);
      client.set("products", JSON.stringify(products));
  
      return res.status(200).send(prob);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });
  
  module.exports = router;
  





