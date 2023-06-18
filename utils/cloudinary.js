require('dotenv').config();
const cloudinaryModel = require('cloudinary');


const cloudinary = cloudinaryModel.v2;//[v2] its come from cloudinay;

//now let's confingure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary