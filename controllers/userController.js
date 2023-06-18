const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const gnenerateToken = (id, isAdmin)=>{
    return jwt.sign({id, isAdmin}, process.env.JWT_SECRET, {
        expiresIn:'1d'
    });
}

//Register user;
const registerUser = asyncHandler(async (req, res)=>{
      const {name, email, password} = req.body;
      if(!name || !email || !password) return res.status(400).json({message:'All fields are required!'});

      //check for duplicate
      const duplicate = await User.findOne({email});
      if(duplicate) return res.status(409).json({message:'Email is already exsit!'});

      //create new user
      const user = await User.create({name, email, password});

      const token = gnenerateToken(user._id, user.isAdmin);

      if(user){
        return res.status(200).json({
            user,
            token
        });
      }else{
        return res.status(400).json({message:'Something went wrong!'});
      }
});

//Login user;
const loginUser = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({message:'Email and Password required!'});

    //Find user to login
    const user = await User.findOne({email});
    if(!user) return res.status(404).json({message:'User not found whit this email!'});

    const token = gnenerateToken(user._id, user.isAdmin);

    //check for validUser
    const validUser = await bcrypt.compare(password, user.password);

    if(user && validUser){
      return res.status(200).json({
          user,
          token
      });
    }else{
      return res.status(400).json({message:'Invalid Password!'});
    }
});


const checkAdmin = asyncHandler(async (req, res)=>{
  res.send('you are an admint')
});


module.exports = {
    registerUser,
    loginUser,
    checkAdmin
}