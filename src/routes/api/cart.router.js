const { Router } = require ('express');

const cartsRouter = Router();

const CartController = require('../../controllers/carts.controller')

const cartController = new CartController()

cartsRouter.post('/', cartController.createCart);

cartsRouter.get('/:cid', cartController.getCart);

cartsRouter.post('/:cid/product/:pid', cartController.addProductToCart);

cartsRouter.delete('/:cid/products/:pid', cartController.deleteProductFromCart);

//cartsRouter.put('/:cid', cartController.updateCart);

//cartsRouter.put('/:cid/products/:pid', cartController.updateProductQuantity);

//cartsRouter.delete('/:cid', cartController.removeAllProducts);

cartsRouter.post('/:cid/purchase', cartController.purchaseCart);


module.exports = cartsRouter;