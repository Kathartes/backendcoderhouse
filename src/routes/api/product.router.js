const {Router} = require('express');
const ProductController = require('../../controllers/products.controller');

const productRouter = Router();
const productController = new ProductController();

productRouter.get('/', productController.getProducts)

productRouter.get('/:pId', productController.getProductByFilter)

productRouter.post('/', productController.createProduct)

productRouter.put('/:pId', productController.updateProduct)

productRouter.delete('/:pId', productController.deleteProduct)


module.exports = productRouter;