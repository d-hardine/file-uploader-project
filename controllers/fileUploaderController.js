const bcrypt = require('bcryptjs')
const passport = require('passport')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { validationResult } = require('express-validator')
const db = require('../db/queries')
const validators = require('../config/validators')

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
            console.log(req.body)
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            await db.createNewUser(req.body.firstname, req.body.lastname, req.body.username, hashedPassword)
            res.status(201).redirect('/')
        }
    } catch(err) {
        console.error(err)
        return next(err)
    }
}]



const indexLoginAuth = passport.authenticate('local', {failureRedirect:'/sign-up', failureMessage: true})
const indexLoginSuccess = (req, res) => {
    res.redirect(`/profile`)
}

const profileGet = (req, res) => {
    if(req.isAuthenticated())
        res.render('profile', {user: req.user})
    else
        res.redirect('/')
}

const uploadTest = upload.single('avatar')
const uploadTestNext = (req, res) => res.redirect('/profile')

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
    indexLoginSuccess,
    profileGet,
    uploadTest,
    uploadTestNext,
    logoutGet
}