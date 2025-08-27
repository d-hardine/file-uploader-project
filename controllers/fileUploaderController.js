const path = require('node:path')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { validationResult } = require('express-validator')
const db = require('../db/queries')
const validators = require('../config/validators')
const multer  = require('multer')

//setting the upload location and file naming for multer middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    let fn = file.originalname + ' - ' + Date.now() + path.extname(file.originalname)
    cb(null, fn)
  }
})

const upload = multer({ storage: storage })

const indexGet = (req, res) => {res.render('index', {user: req.user})}

const signupGet = (req, res) => {
    if(req.isAuthenticated())
        res.redirect('/')
    else
        res.render('sign-up')
}

const signupPost = [validators.validateUser, async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const { firstname, lastname, username } = req.body
            return res.status(400).render("sign-up", {firstname: firstname, lastname:lastname, username:username, errors: errors.array()})
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            await db.createNewUser(req.body.firstname, req.body.lastname, req.body.username, hashedPassword)
            res.status(201)
            next()
        }
    } catch(err) {
        console.error(err)
        return next(err)
    }
}]

const indexLoginAuth = passport.authenticate('local', {successRedirect: '/dashboard' ,failureRedirect:'/sign-up'})

const dashboardGet = async (req, res) => {
    if(req.isAuthenticated()) {
        const uploadedFiles = await db.getUploadedFiles(req.user)
        res.render('dashboard', {user: req.user, uploadedFiles: uploadedFiles})
    }
    else
        res.redirect('/')
}

const uploadMiddleware = upload.single('upload')
const uploadNext = async (req, res) => {
    await db.storageCreate(req.user, req.file)
    res.redirect('/dashboard')
}

const downloadTest = async (req, res) => {
    if(req.isAuthenticated()) {
        const downloadFileInfo = await db.downloadFile(req.params.storageId)
        res.download(downloadFileInfo[0].filePath, downloadFileInfo[0].originalFileName, (err) => {
        if(err)
            res.status(404).send('File not found')
        })
    }
}

const logoutGet = (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next(err)
        }
    res.redirect('/')
    })
}

module.exports = {
    indexGet,
    signupGet,
    signupPost,
    indexLoginAuth,
    dashboardGet,
    uploadMiddleware,
    uploadNext,
    downloadTest,
    logoutGet
}