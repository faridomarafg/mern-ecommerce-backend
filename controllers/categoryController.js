const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');


//Get all Categories
const getCategories = asyncHandler(async (req, res)=>{
    const categories = await Category.find().sort({createdAt: '-1'});
    if(!categories) return res.status(404).json({message:'No category is avialable now!'});

    return res.status(200).json(categories)
});

//Get single Category
const getCategory = asyncHandler(async (req, res)=>{
    const category = await Category.findById(req.params.id);
    if(!category) return res.status(404).json({message:'No category is avialable with this ID!'});

    return res.status(200).json(category)
});


//Create Category
const createCategory = asyncHandler(async (req, res)=>{
    const {name} = req.body
    if(!name) return res.status(400).json({message:'Category Name is required!'})

    //Check for duplicate category
    const duplicate = await Category.findOne({name});
    if(duplicate) return res.status(400).json({message:'This Category is existed already!'})

    const category = await Category.create({name: name.toUpperCase()});
   
    return res.status(201).json(category);
});

//Update Category
const updateCategory = asyncHandler(async (req, res)=>{
    const {name} = req.body;
    const id = req.params.id;

        //Check for duplicate category before update
        const duplicate = await Category.findOne({name});
        if(duplicate) return res.status(400).json({message:'This Category is existed already!'})

    //find category to update
    const category = await Category.findByIdAndUpdate(id, {name: name.toUpperCase()}, {
        new: true
    });

    return res.status(200).json(category)
});

//Delete Category
const deleteCategory = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    //find category to delete
    await Category.findByIdAndDelete(id);

    return res.status(200).json({message:'Category Deleted!'})
});


module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}