const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../utils/cloudinary');


//Get all products
const getAllProducts = asyncHandler(async (req, res)=>{
    const products = await Product.find();
    if(!products?.length) return res.status(404).json({message: 'No prodcut is available!'});

    res.status(200).json(products);
});

//Get Product ByID
const getProduct = asyncHandler(async (req, res)=>{
  const product = await Product.findById(req.params.id);
  if(!product) return res.status(404).json({message: 'No prodcut found with this ID!'});

  return res.status(200).json(product);
});


//Create Product
const createProduct = asyncHandler(async (req, res)=>{
    const {name, brand, desc, image, price,category,quantity} = req.body;
    
    try {
        if(image){
            const uploadeRes  = await cloudinary.uploader.upload(image,{
                upload_preset: "ecommerceapp"
            })
    
            if(uploadeRes){
              const product = new Product({
                name,
                brand,
                desc,
                price,
                category,
                quantity,
                image: uploadeRes
              });  
              const saveProduct = await product.save();
    
              return res.status(201).json(saveProduct)
            }
        }
    } catch (error) {
      res.status(400).json(error.message)
      console.error(error)  
    }
});

//Update Product
// const updateProduct= asyncHandler(async (req, res)=>{
//    const id = req.params.id 
//    //find produt to update
//    const prodcut = await Product.findById(id);
//    if(!prodcut) res.status(404).json({message:'Product not found!'});

//    const updatedP = await Product.findByIdAndUpdate(id, {...req.body},{new: true});
   
//    return res.status(200).json(updatedP);
// });

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, brand, desc, image, price, category, quantity } = req.body;
  const productId = req.params.id;

  try {
    // Find the product by its ID
    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product properties
    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.desc = desc || product.desc;
    product.price = price || product.price;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;

    // Check if an image is provided for update
    if (image) {
      // Upload the new image to Cloudinary
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: 'ecommerceapp'
      });

      // Update the product's image property with the new image URL
      product.image = uploadRes;
    }

    // Save the updated product
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json(error.message);
    console.error(error);
  }
});


//delete Product
const deleteProduct= asyncHandler(async (req, res)=>{
  //find product to delete
  const product = await Product.findById(req.params.id);

  const deletedProduct = await product.deleteOne();
  return res.status(200).json(deletedProduct);
});



module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct
};