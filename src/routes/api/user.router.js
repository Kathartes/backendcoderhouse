const { Router } = require('express');
const UserController = require('../../controllers/user.controller');
const passport =require('passport');
const { authenticationJwtCurrent } = require('../../middlewares/jwtPassport.middleware');
const { passportCall } = require('../../utils/passportCall')
const { uploader } = require('../../utils/multer')

const userRouter = Router()
const userController = new UserController()


userRouter.get('/', userController.getUser)

//userRouter.get('/:email', userController.getUserByFilter)

userRouter.put('/:uid', userController.updateUser)

userRouter.post('/register', userController.createUser)

userRouter.post('/login', userController.createLogin)

userRouter.get('/current', passportCall('jwt'), authenticationJwtCurrent, userController.getCurrentUser)

userRouter.delete('/:uid', userController.deleteUser)

userRouter.post('/:uid/documents', uploader.fields([{name: 'identificacion', maxCount: 1}, 
                                                    {domicilio: 'domicilio', maxCount: 1}, 
                                                    {cuenta: 'cuenta', maxCount: 1}]), userController.uploadFiles)

userRouter.put('/premium/:uid', userController.updateUser)

module.exports = userRouter;



