
class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    createCart = async () => await this.dao.create()

    deleteCart = async (cartId) => await this.dao.delete(cartId)

    getFromCart = async (cartId, productId) => await this.dao.getFromCart(cartId, productId)
    
    getCart =  async (cartId) => await this.dao.getBy(cartId)

    deleteProduct = async (cartId, productId) => await this.dao.remove(cartId, productId) 

    removeAllProducts = async(cartId) => await this.dao.removeAll(cartId)

    addProductToCart = async(cartId, productId, quantity) => await this.dao.add(cartId, productId, quantity)

    updateProductQuantity = async (cartId, productId, quantity) => await this.dao.updateQuantity(cartId, productId, quantity)

    updateCart = async (cartId, products) => await this.dao.update(cartId, products)
}


module.exports = { CartRepository }