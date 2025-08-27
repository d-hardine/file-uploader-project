const { Router } = require('express')
const fileUploaderController = require('../controllers/fileUploaderController');
const fileUploaderRouter = Router()

fileUploaderRouter.get('/', fileUploaderController.indexGet)
fileUploaderRouter.post('/', fileUploaderController.indexLoginAuth)
fileUploaderRouter.get('/sign-up', fileUploaderController.signupGet)
fileUploaderRouter.post('/sign-up', fileUploaderController.signupPost, fileUploaderController.indexLoginAuth) //auto login after create an account
fileUploaderRouter.get('/dashboard', fileUploaderController.dashboardGet)
fileUploaderRouter.post('/dashboard', fileUploaderController.uploadMiddleware, fileUploaderController.uploadNext)
fileUploaderRouter.get('/download/:storageId', fileUploaderController.downloadTest)
fileUploaderRouter.get('/log-out', fileUploaderController.logoutGet)

module.exports = fileUploaderRouter