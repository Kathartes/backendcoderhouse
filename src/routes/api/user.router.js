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

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), userController.logout);

userRouter.get('/current', passportCall('jwt'), authenticationJwtCurrent, userController.getCurrentUser)

userRouter.delete('/:uid', userController.deleteUser)

userRouter.post('/:uid/documents', uploader.fields([{name: 'identificacion', maxCount: 1}, 
                                                    {name: 'domicilio', maxCount: 1}, 
                                                    {name: 'cuenta', maxCount: 1},
                                                    {name: 'profile', maxCount: 1}]), userController.uploadFiles)

userRouter.put('/premium/:uid', userController.updateUser)

userRouter.put('/admin/:uid', userController.updateUserAdmin)

userRouter.delete('/admin/inactives', userController.deleteTime)

userRouter.post('/recover', userController.userRecovery);

userRouter.post('/resetpass', userController.resetPass)


module.exports = userRouter;



