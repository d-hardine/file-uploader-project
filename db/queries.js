const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

async function createNewUser(firstName, lastName, username, hashedPassword) {
    return await prisma.user.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: hashedPassword
        }
    })
}

async function isUsernameDuplicate(inputtedUsername) {
    return await prisma.user.findUnique({
        where: {
            username: inputtedUsername
        }
    })
}

module.exports = { createNewUser, isUsernameDuplicate }