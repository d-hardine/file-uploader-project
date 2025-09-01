const { Router } = require('express')
const fileUploaderController = require('../controllers/fileUploaderController');
const fileUploaderRouter = Router()

fileUploaderRouter.get('/', fileUploaderController.indexGet)
fileUploaderRouter.post('/', fileUploaderController.indexLoginAuth)

fileUploaderRouter.get('/sign-up', fileUploaderController.signupGet)
fileUploaderRouter.post('/sign-up', fileUploaderController.signupPost, fileUploaderController.indexLoginAuth) //auto login after create an account

fileUploaderRouter.get('/dashboard', fileUploaderController.dashboardGet)
fileUploaderRouter.get('/dashboard/:folderId', fileUploaderController.dashboardFolderGet)

fileUploaderRouter.post('/upload', fileUploaderController.uploadGetButActuallyPost)
fileUploaderRouter.post('/upload-post', fileUploaderController.uploadRealPost, fileUploaderController.uploadRealPostNext)

fileUploaderRouter.get('/download/:storageId', fileUploaderController.downloadGet)

fileUploaderRouter.post('/create-folder', fileUploaderController.createFolderGetButActuallyPost)
fileUploaderRouter.post('/create-folder-post', fileUploaderController.createFolderRealPost)

fileUploaderRouter.post('/rename-folder', fileUploaderController.renameFolderGetButActuallyPost)
fileUploaderRouter.post('/rename-folder-post', fileUploaderController.renameFolderRealPost)

fileUploaderRouter.post('/rename-file', fileUploaderController.renameFileGetButActuallyPost)
fileUploaderRouter.post('/rename-file-post', fileUploaderController.renameFileRealPost)

fileUploaderRouter.post('/delete', fileUploaderController.deleteFilePost)

fileUploaderRouter.get('/log-out', fileUploaderController.logoutGet)
fileUploaderRouter.get('{*splat}', (req, res) => res.status(404).send('where are you going lil bro'))

module.exports = fileUploaderRouter