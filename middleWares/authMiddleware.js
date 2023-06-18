const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      req.user = await User.findById(decoded.id)

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const isAdmin = asyncHandler(async (req, res, next) => {
   if(req.user.isAdmin){
    return next()
   }
   return res.status(401).json({message:'you are not an admin'})
})


const isUser = asyncHandler(async (req, res, next) => {
  if(req.user._id === req.params.id || req.user.isAdmin){
   return next()
  }
  return res.status(401).json({message:'Access denied, not authorized!'})
})


module.exports = { protect, isAdmin, isUser }