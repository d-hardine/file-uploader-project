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

async function getUploadedFiles(user) {
    return await prisma.storage.findMany({
        where: {
            authorId: user.id
        }
    })
}

async function storageCreate(user, fileInfo) {
    return await prisma.storage.create({
        data: {
            authorId: user.id,
            originalFileName: fileInfo.originalname,
            filePath: fileInfo.path
        }
    })
}

async function downloadFile(id) {
    return await prisma.storage.findMany({
        where: {
            id: Number(id)
        }
    })
}

module.exports = { createNewUser, isUsernameDuplicate, getUploadedFiles, storageCreate, downloadFile }