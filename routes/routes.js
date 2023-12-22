const controllers = require("../controllers/controllers");
const { body } = require('express-validator');
const multer = require('multer');
const express = require("express");
const router = express.Router();
const imageUploader = multer();

router.get("/products", controllers.getAllProducts);
router.post("/product",imageUploader.single('image'), controllers.addNewProduct);
router.put("/product",[ 
body('title').notEmpty().withMessage('Title is required'),
body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price should be a number'),
body('description').notEmpty().withMessage('Description is required'),
], controllers.updateProduct);
router.delete("/product/:pId", controllers.deleteProduct);

module.exports = router;