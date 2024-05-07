const { Router } = require('express')
const ViewsController = require('../controllers/views.controller.js')
const { handlePolicies } = require('../middlewares/handlePolicies.middlewares.js')

const router = Router()

const viewsController = new ViewsController()


router.get('/products', handlePolicies(['USER', 'PREMIUM']), viewsController.products)

router.get('/users', viewsController.users)

router.get('/login', handlePolicies(['PUBLIC']), viewsController.login)

router.get('/register', handlePolicies(['PUBLIC']), viewsController.register)

router.get('/manager', handlePolicies(['PREMIUM', 'ADMIN']), viewsController.manager);

router.get('/role', handlePolicies(['USER', 'PREMIUM']), viewsController.role);

router.get('/admin', handlePolicies(['ADMIN']), viewsController.admin);

router.get('/recover', handlePolicies(['PUBLIC']), viewsController.recover);

router.get('/passrecovery/:token', handlePolicies(['PUBLIC']), viewsController.passRecovery);

module.exports = router