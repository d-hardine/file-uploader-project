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

const indexGet = (req, res) => {
    if(req.isAuthenticated())
        res.redirect('/dashboard')
    else {
        res.render('index', {loginError: req.session.messages})
        req.session.messages = undefined
    }
}

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

const indexLoginAuth = passport.authenticate('local', {successRedirect:'/dashboard', failureRedirect:'/', failureMessage: true})

const dashboardGet = async (req, res) => {
    if(req.isAuthenticated()) {
        const rootFolderInfo = await db.getRootFolderInfo(req.user.id)
        const nextFoldersInfo = await db.getNextFolderInfo(rootFolderInfo.folderIdAfter)
        const uploadedFiles = await db.getUploadedFiles(req.user, rootFolderInfo.id)
        res.render('dashboard', {
            user: req.user,
            currentFolderInfo: rootFolderInfo,
            uploadedFiles: uploadedFiles,
            nextFoldersInfo: nextFoldersInfo,
            currentUrl: req.originalUrl
        })
    }
    else
        res.redirect('/')
}

const dashboardFolderGet = async (req, res) => {
    if(req.isAuthenticated()) {
        const currentFolderInfo = await db.getCurrentFolderInfo(req.user.id, req.params.folderId)
        const nextFoldersInfo = await db.getNextFolderInfo(currentFolderInfo.folderIdAfter)
        const uploadedFiles = await db.getUploadedFiles(req.user, currentFolderInfo.id)
        res.render('dashboard', {
            user: req.user,
            currentFolderInfo: currentFolderInfo,
            uploadedFiles: uploadedFiles,
            nextFoldersInfo: nextFoldersInfo,
            currentUrl: req.originalUrl
        })
    }
    else
        res.redirect('/')
}

const uploadGetButActuallyPost = (req, res) => {
    if(req.isAuthenticated()) {
        res.render('upload', {user: req.user, currentFolderId: req.body.currentFolderId, currentUrl: req.body.currentUrl })
    }
    else
        res.redirect('/')
}

const uploadRealPost = upload.single('upload')
const uploadRealPostNext = async (req, res) => {
    const currentFolderInfo = await db.getCurrentFolderInfo(req.user.id, req.body.currentFolderId)
    await db.uploadFile(req.user, req.file, currentFolderInfo.id)
    res.redirect(req.body.currentUrl)
}

const downloadGet = async (req, res) => {
    if(req.isAuthenticated()) {
        const downloadFileInfo = await db.downloadFile(req.params.storageId)
        res.download(downloadFileInfo[0].filePath, downloadFileInfo[0].originalFileName, (err) => {
        if(err)
            res.status(404).send('File not found')
        })
    }
    else
        res.redirect('/')
}

const createFolderGetButActuallyPost = async (req, res) => {
    if(req.isAuthenticated()) {
        res.render('create-folder', {user: req.user, currentFolderId: req.body.currentFolderId, currentUrl: req.body.currentUrl })
    }
    else
        res.redirect('/')
}

const createFolderRealPost = async (req, res) => {
    if(req.isAuthenticated()) {
        const currentFolderInfo = await db.getCurrentFolderInfo(req.user.id, req.body.currentFolderId)
        await db.createFolder(req.user, req.body.newFolderName, currentFolderInfo.id)
        res.redirect(req.body.currentUrl)
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
    dashboardFolderGet,
    uploadGetButActuallyPost,
    uploadRealPost,
    uploadRealPostNext,
    downloadGet,
    createFolderGetButActuallyPost,
    createFolderRealPost,
    logoutGet
}