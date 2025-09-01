const cloudinary = require('cloudinary').v2
require('dotenv').config()

//initializing cloudinary
cloudinary.config({
    cloud_name: 'do1rucyzl',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})