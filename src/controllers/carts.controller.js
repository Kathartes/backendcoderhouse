const { userService, productService, cartService, ticketService } = require('../repositories/services')
const { generateUniqueCode } = require('../helpers/cartHelper')
const { EErrors } = require('../services/errors/enums');
const { generatePurchaseCartErrorInfo } = require('../services/errors/errorGenerator');
const CustomError = require('../services/errors/CustomError')

class CartController{
    constructor(){
        this.cartService = cartService
        this.productService =  productService
        this.userService = userService
        this.ticketService = ticketService
    }
    
    getCarts =  async (req, res) => {
        try {
            const carts = await cartService.getCarts()
            console.log(carts)
            res.status(200).json({
                status: 'success',
                payload: carts
            })        
        } catch (error) {
            console.log(error)
        }
    }
  

    getCart = async (req, res) => {
        try {
            const { cid } = req.params
            const cart = await cartService.getCart(cid)
            // console.log('cart de controllers',cart)
            if (!cart) {
                return res.status(401).render({
                    status: 'error',
                    message: 'Cart not found'
                })
                
            }
            res.status(200).json({
                cart
            })            
        } catch (error) {
            console.log(error)
        }
    }

    createCart = async (req, res) => {
        try {
            const resp = await cartService.createCart()
            if (!resp) {
                return res.status(404).json(resp)
            }        
            res.status(200).json(resp) 
        } catch (error) {
            console.log(err)
        }
        // const carrito = req.body
    }

    addProductToCart = async (req, res) => {
        try {
            
            const cartId = req.params.cid
            const productId = req.params.pid
            const quantity  = req.body.quantity || 1;
            const cartProduct = await this.cartService.getFromCart(cartId, productId)
            const user = await this.userService.getUserByFilter({cart: cartId})
            const product = await this.productService.getProductByFilter({ _id: productId})

            console.log(cartId, productId, quantity + "antes de entrar")
            console.log(user.email)
            console.log(product.owner)
            //if (!resp) return res.status(404).json({status: 'error', message: 'Cart not found'})
            if(user.email === product.owner){
                
                console.log("no podes agregar un producto tuyo")
                throw new Error("Este producto es tuyo")
            }
            if(cartProduct) {
                console.log(cartId, productId, quantity + "adentro de upgrade quantity")
                await this.cartService.updateProductQuantity(cartId, productId, quantity)
                
            }else {
                console.log(cartId, productId, quantity + "adentro de agregar producto")
                 await this.cartService.addProductToCart(cartId, productId, quantity)
            }

            console.log(cartId, productId, quantity)

            res.status(200).json({
                status: 'success', 
                message: 'Product added to cart'
            })        
        } catch (error) {
            console.log(error)
        }
    }

    deleteProductFromCart  = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const resp = await cartService.deleteProduct(cid, pid)
            if (!resp) return cartService.status(404).json({status: 'error', message: 'Cart not found'})
            res.status(200).json({
                status: 'success',
                message: 'Product deleted from cart'
            })        
        } catch (error) {
            console.log(error)
        }
    }

    removeAllProducts = async (req, res) => {
        try {
            const { cid } = req.params
            const resp = await cartService.removeAllProducts(cid) 
            if (!resp) return res.status(404).json({status: 'error', message: 'Cart not found'})
            res.status(200).json(resp)
        } catch (error) {
            console.log(error)
        }
    }

    checkoutCart = async (req, res) => {
        const cartId = req.params.cid;
        console
      


        res.json({
            status: 'success',
            message: 'Purchase completed successfully',
        })
    }

   

    purchaseCart = async (req, res, next) => {
        try {
            const cartId = req.params.cid;
            const cart = await this.cartService.getCart(cartId);
            const user = await this.userService.getUserByFilter({ cart: cartId });
            const products = cart.products;
            const failedProducts = [];
            let totalAmount = 0;

            for (const productData of products) {
                const product = await this.productService.getProductByFilter(productData.productId);
                
                if (!product) {
                    return res.status(404).json({ message: `Producto ${productData.productId} no encontrado` });
                }
           
                if (product.stock === 0) {
                    CustomError.createError({
                        name: 'Product Stock error',
                        cause: generatePurchaseCartErrorInfo(product.title, product.stock, productData.quantity),
                        message: 'Error trying to purchase a product',
                        code: EErrors.CART_OPERATION_ERROR
                      })
                }

                const purchaseQuantity = Math.min(product.stock, productData.quantity);
                product.stock -= purchaseQuantity;
                totalAmount += product.price * purchaseQuantity;
                if (purchaseQuantity < productData.quantity) {
                    failedProducts.push({ ...productData, quantity: productData.quantity - purchaseQuantity });
                    productData.quantity -= purchaseQuantity;
                }
                await this.productService.updateProduct(product._id, product);
            }

            const ticketData = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: totalAmount.toFixed(2),
                purchaser: user.email,
            };
            const ticket = await this.ticketService.createTicket(ticketData);

            if (failedProducts.length > 0) {

                await this.cartService.updateCart(cartId, products);
                return res.status(200).json({ message: 'Algunos productos no pudieron ser comprados', failedProducts });
            } else {

                await this.cartService.removeAllProducts(cartId);
                return res.status(200).json({ message: 'Compra finalizada con éxito', ticket });
            }
        } catch (error) {
     
            next(error)
        }
    }


}

module.exports = CartController