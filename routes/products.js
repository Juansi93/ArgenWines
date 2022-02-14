"use strict";
const express = require("express");
const cloudinary = require('cloudinary').v2;
const util = require('util')
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);
const router = express.Router();
const productsModel = require('../models/productsModel');

router.get("/", async (req, res) => {
  const products = await productsModel.getProducts();
  const data = products.map((row) => {
    const imageURL = cloudinary.url(row.image, {
      with: 200, 
      height: 200,
      crop: 'fill',
    })
    return { ...row, imageURL}
    
  });
  res.render("products", { user: req.session.user, data});
});

router.get("/white", async (req, res) => {
  const products = await productsModel.getWhiteWine();
  const data = products.map((row) => {
    const imageURL = cloudinary.url(row.image, {
      with: 200, 
      height: 200,
      crop: 'fill',
    })
    return { ...row, imageURL}
    
  });
  res.render("whiteWine", { user: req.session.user, data});
});

router.get("/rose", async (req, res) => {
  const products = await productsModel.getRoseWine();
  const data = products.map((row) => {
    const imageURL = cloudinary.url(row.image, {
      with: 200, 
      height: 200,
      crop: 'fill',
    })
    return { ...row, imageURL}
    
  });
  res.render("roseWine", { user: req.session.user, data});
});

router.get('/addItem', (req, res) => {
  res.render('addItem');
}); 

router.post('/addItem', async (req, res) => {
  const imageFile = req.files.imageFile;
  const img_id = (await uploader(imageFile.tempFilePath)).public_id;
  await productsModel.addProduct({...req.body, image:img_id});
  res.redirect('/products');
});


router.get('/handleEdit/:id', async (req, res) => {
  const row = await productsModel.getProduct(req.params.id)
  const product = {
    id: row[0].id,
    name: row[0].name,
    origin: row[0].origin,
    description: row[0].description,
    price: row[0].price,
    image: row[0].image,
  };
  res.render("editItem", { product });
});



router.post('/editProduct', async (req, res) => {
  let img_id = null;
  if(!req.files) {
    img_id = req.body.prevImage
  } else {
    const row = await productsModel.getProduct(req.body.id);
    await destroy(row[0].image);
    const imageFile = req.files.imageFile;
    img_id = (await uploader(imageFile.tempFilePath)).public_id;
  }
  const data = {
    id: req.body.id,
    name: req.body.name,
    origin: req.body.origin,
    description: req.body.description,
    price: req.body.price,
    image: img_id,
  };
  await productsModel.modifyProduct(data, data.id);
  res.redirect("/products");
  
});


router.get("/deleteProduct/:id", async (req, res) => {
  const row = await productsModel.getProduct(req.params.id);
  await destroy(row[0].image);
  await productsModel.deleteProduct(req.params.id)
  res.redirect('/products');
});






module.exports = router;