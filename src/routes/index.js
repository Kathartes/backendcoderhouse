const {Router} = require('express')
const userRouter = require('./api/user.router')
const productRouter = require('./api/product.router')
const viewsRouter = require('./views.router') 

const router = Router()


router.use('/api/users', userRouter)
router.use('/api/products', productRouter)
router.use('/', viewsRouter)

router.use((err, req, res, next)=>{
    console.log(err)
    res.status(500).send('Error Server')
})

module.exports = router