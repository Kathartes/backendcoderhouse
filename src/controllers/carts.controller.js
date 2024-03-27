const { userService, productService, cartService, ticketService } = require('../repositories/services')


class CartController{
    constructor(){
        this.cartService = cartService
        this.productService =  productService
        this.userService = userService
        this.ticketService = ticketService
    }
    
    createCart = async (req, res) => {
        try {
            const newCart = await this.cartService.createCart();
            res.json({ cart: newCart });//res.send({status: 'success', payload: newCart})
        } catch (error) {
            logger.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    } 
            
    getCart = async (req, res) => {
        try {
            //const cartId = req.params.cid;(anterior)
            const { cid } = req.params
            const cart = await this.cartService.getCart({ _id: cid });
            res.json({ cart });//res.send({status: 'success', payload: cart})
        } catch (error) {
            logger.error(error.message);
            res.status(404).send('Cart Not Found');
        }
    }

}

module.exports = CartController