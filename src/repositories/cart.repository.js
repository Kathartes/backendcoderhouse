
class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    createCart = async () => await this.dao.create()
    
    getCart =  async (cartId) => await this.dao.getBy(cartId)

    deleteProduct = async (cartId, productId) => await this.dao.remove(cartId, productId) 

    deleteCart = async(cartId) => await this.dao.deleteById(cartId)

    addProductToCart = async(cartId, productId, quantity) => await this.dao.add(cartId, productId, quantity)

    updateProductQuantity = async (cartId, productId, quantity) => await this.dao.updateQuantity(cartId, productId, quantity)
}

module.exports = { CartRepository }