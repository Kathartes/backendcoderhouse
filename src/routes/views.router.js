const { Router } = require('express')
const ViewsController = require('../controllers/views.controller.js')

const router = Router()

const viewsController = new ViewsController()


router.get('/products', viewsController.products)

router.get('/users', viewsController.users)

router.get('/login', viewsController.login)

router.get('/register', viewsController.register)

router.get('/manager', viewsController.manager);

router.get('/role', viewsController.role);

module.exports = router