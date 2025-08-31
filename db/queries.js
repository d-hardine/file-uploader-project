const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

async function createNewUser(firstName, lastName, username, hashedPassword) {
    return await prisma.user.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: hashedPassword,
            folders: {
                create: {
                    folderName: 'root',
                }
            }
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

async function getUploadedFiles(user, currentFolderId) {
    return await prisma.storage.findMany({
        where: {
            authorId: user.id,
            folderId: currentFolderId
        }
    })
}

async function uploadFile(user, fileInfo, currentFolderId) {
    return await prisma.storage.create({
        data: {
            authorId: user.id,
            originalFileName: fileInfo.originalname,
            filePath: fileInfo.path,
            folderId: currentFolderId,
        }
    })
}

async function downloadFile(storageId) {
    return await prisma.storage.findMany({
        where: {
            id: Number(storageId)
        }
    })
}

async function createFolder(user, newFolderName, currentFolderId) {
    const newFolderQuery = await prisma.folder.create({
        data: {
            authorId: user.id,
            folderIdBefore: currentFolderId,
            folderName: newFolderName,
        }
    })
    console.log(await prisma.folder.updateMany({
        where: {
            AND: [
                {authorId: user.id},
                {id: currentFolderId}
            ]
        },
        data: {
            folderIdAfter: { push: newFolderQuery.id }
        }
    }))
}

async function getRootFolderInfo(userId) {
    return await prisma.folder.findFirst({
        where: {
            authorId: userId,
            folderName: 'root'
        },
        orderBy: {
            folderName: 'asc'
        }
   })
}

async function getCurrentFolderInfo(userId, currentFolderId) {
    return await prisma.folder.findFirst({
        where: {
            authorId: userId,
            id: Number(currentFolderId)
        },
        orderBy: {
            folderName: 'asc'
        }
   })
}

async function getNextFolderInfo(nextFolderArray) {
    return await prisma.folder.findMany({
        where: {
            id: {
                in: nextFolderArray
            }
        }
    })
}

module.exports = {
    createNewUser,
    isUsernameDuplicate,
    getUploadedFiles,
    uploadFile,
    downloadFile,
    createFolder,
    getRootFolderInfo,
    getCurrentFolderInfo,
    getNextFolderInfo
}