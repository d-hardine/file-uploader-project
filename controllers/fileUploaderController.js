const bcrypt = require('bcryptjs')
const passport = require('passport')
const { body, validationResult } = require('express-validator')
const { PrismaClient } = require('../generated/prisma')
//const { PrismaClient } = require('@prisma/client/edge')
const prisma = new PrismaClient

const indexLoginGet = (req, res) => {res.render('index', {user: req.user})}

const signupGet = (req, res) => {
    if(req.isAuthenticated())
        res.redirect('/')
    else
        res.render('sign-up')
}


const validateUser = [
    body('firstname').trim()
        .isAlpha().withMessage(`First name must only contain letters.`)
        .isLength({min: 3, max: 15}).withMessage(`First name must be between 3 and 15 characters.`),
    body('lastname').trim()
        .isAlpha().withMessage(`Last name must only contain letters.`)
        .isLength({min: 3, max: 15}).withMessage(`Last name must be between 3 and 15 characters.`),
    body('username').trim()
        .isLength({min: 3, max: 15}).withMessage(`Username must be between 3 and 15 characters.`)
        /*.custom(async (value) => {
            const isDuplicateUsername = await db.duplicateUsernameSearch(value)
            if(isDuplicateUsername) {
                throw new Error('Username has been used, pick another one.')
            }
        })*/,
    body('password').isStrongPassword({ //it needs at least 5 conditions written to make it work, which is stupid
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0
    }).withMessage(`Password must be at least 8 characters, with numbers and letters.`),
    body('confirmPassword').custom((confirmedPasswordvalue, {req}) => {
        return confirmedPasswordvalue === req.body.password
    }).withMessage("Password and confirm password doesn't match.")
]

const signupPost = [validateUser, async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const { firstname, lastname, username } = req.body
            return res.status(400).render("sign-up", {firstname: firstname, lastname:lastname, username:username, errors: errors.array()})
        } else {
            console.log(req.body)
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            await prisma.user.create({
                data: {
                    firstName: req.body.firstname,
                    lastName: req.body.lastname,
                    username: req.body.username,
                    password: hashedPassword
                }
            })
            res.status(201).redirect('/')
        }
    } catch(err) {
        console.error(err)
        return next(err)
    }
}]



const indexLoginPost = passport.authenticate('local', {successRedirect:'/', failureRedirect:'/sign-up'})


const logoutGet = (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next(err)
        }
    res.redirect('/')
    })
}
/*
const newMessageGet = (req, res) => {
    if(req.isAuthenticated())
        res.render('newMessage')
    else
        res.status(401).send('<b>you are not authenticated</b>')
}

const newMessagePost = async (req, res) => {
    const { messageTitle, messageContent } = req.body
    const date = new Date()
    await db.postNewMessage(req.user.id, messageTitle, messageContent, date)
    res.redirect('/')
}

const deleteMessagePost = async (req, res) => {
    await db.deleteMessage(req.body.messageId)
    res.redirect('/')
}

const adminGet = (req, res) => {
    if(req.isAuthenticated() && !req.user.isadmin)
        res.render('admin')
    else if(req.isAuthenticated() && req.user.isadmin)
        res.status(401).send('<b>you are already an administrator</b>')        
    else
        res.status(401).send('<b>you are not authenticated</b>')
}

const validateAdmin = [
    body('passcode').custom((passcodeValue, {req}) => {
        return passcodeValue === 'Bangkok'
    }).withMessage("Wrong passcode. Hint: Capital of Thailand.")
]


const adminPost = [validateAdmin, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(400).render("admin", {errors: errors.array()})
    } else {
        await db.elevateToAdmin(req.user.id)
        res.redirect('/')
    }
}]
*/

module.exports = {
    indexLoginGet,
    signupGet,
    signupPost,
    indexLoginPost,
    logoutGet
}