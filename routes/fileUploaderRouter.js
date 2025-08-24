const { Router } = require('express')
const fileUploaderController = require('../controllers/fileUploaderController');
const fileUploaderRouter = Router()

fileUploaderRouter.get('/', fileUploaderController.indexLoginGet)
fileUploaderRouter.post('/', fileUploaderController.indexLoginPost)
fileUploaderRouter.get('/sign-up', fileUploaderController.signupGet)
fileUploaderRouter.post('/sign-up', fileUploaderController.signupPost, /*fileUploaderController.loginPost*/) //auto login after create an account
fileUploaderRouter.get('/log-out', fileUploaderController.logoutGet)
/*
membersRouter.get('/login', membersController.loginGet)
membersRouter.post('/login', membersController.loginPost)
membersRouter.get('/logout', membersController.logoutGet)
membersRouter.get('/new-message', membersController.newMessageGet)
membersRouter.post('/new-message', membersController.newMessagePost)
membersRouter.post('/delete', membersController.deleteMessagePost)
membersRouter.get('/admin', membersController.adminGet)
membersRouter.post('/admin', membersController.adminPost)
*/

module.exports = fileUploaderRouter