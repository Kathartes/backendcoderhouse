const {Router} = require('express')
const userRouter = require('./api/user.router')
const productRouter = require('./api/product.router')
const cartRouter = require('./api/cart.router')
const viewsRouter = require('./views.router') 
/*const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')
const { swaggerOptions } = require('../config')*/
const router = Router()

router.use('/api/carts', cartRouter)
router.use('/api/users', userRouter)
router.use('/api/products', productRouter)
router.use('/', viewsRouter)

router.use((err, req, res, next)=>{
    console.log(err)
    res.status(500).send('Error Server')
})
router.get('/',(req,res)=>{
    res.redirect('/login')
})

/*const specs = swaggerJsDoc(swaggerOptions)

router.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))*/

module.exports = router