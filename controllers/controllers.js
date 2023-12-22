const Products = require("../model/product");
const { validationResult } = require('express-validator');
const { ResultWithContextImpl } = require("express-validator/src/chain");
const uploadToCloudinary = require("../utility/utils");
// get all {prodcuts} api 
exports.getAllProducts = (req, res, next) => {
     Products.find().then(products => {
        res.status(202).send({
            products,
        });
     }).catch(err => {
        res.status(500).send({
           err: "Server is not responding try again later", 
        });
     })
};
// delete {product} api
exports.deleteProduct = (req, res, next) => {
    const {pId} = req.params;
    Products.findByIdAndDelete(pId).then(deleted => {
        res.status(200).send({response: `product with id => ${deleted._id} delelted!`})
    }).catch(err => {
        res.status(501).send({ err: "Server is not responding try again later"})
    })
}; 
// add {product} api
exports.addNewProduct = async (req, res, next) => {
    const {title, price, features, description} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    };
    const result = await uploadToCloudinary(req.file.buffer);
    const products = new Products({
        title:title,
        image: result.secure_url,
        price:price,
        features:features, 
        description:description,
    });
    products.save().then(success => {
        res.status(201).send({msg: "created successfully" });
    }).catch(err => res.status(500).send({err: "server is not able to create a resource"}));
};
// update {product} api
exports.updateProduct = (req, res, next) => {
    const {id,title, price, features, description} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const updatedProduct = {
        title, price, features, description
    };
    Products.findByIdAndUpdate(id, {updatedProduct}).then(updated => {
        res.status(200).send({updated: "Product has been updated!"});
    }).catch(err => res.send({err : "server is not able to create a resource"}));
};
