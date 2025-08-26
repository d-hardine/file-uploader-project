const {body} = require('express-validator')
const db = require('../db/queries')

const validateUser = [
    body('firstname').trim()
        .isAlpha().withMessage(`First name must only contain letters.`)
        .isLength({min: 3, max: 15}).withMessage(`First name must be between 3 and 15 characters.`),
    body('lastname').trim()
        .isAlpha().withMessage(`Last name must only contain letters.`)
        .isLength({min: 3, max: 15}).withMessage(`Last name must be between 3 and 15 characters.`),
    body('username').trim()
        .isLength({min: 3, max: 15}).withMessage(`Username must be between 3 and 15 characters.`)
        .custom(async (inputtedUsername) => {
            const isUsernameDuplicate = await db.isUsernameDuplicate(inputtedUsername)
            if(isUsernameDuplicate) {
                throw new Error('Username has been used, please pick another one.')
            }
        }),
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

module.exports = { validateUser }