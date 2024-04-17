const { cartsModel } = require('./models/carts.model')

class CartDaoMongo {
  constructor() {
    this.model = cartsModel;
  } 
  async create() {
    return await this.model.create({products: [] })
  }
  async getBy(cartId) {
    return await this.model.findOne({_id: cartId})
  }
  async getFromCart(cartId,productId) {
    return await this.model.findOne({_id: cartId, products: {$elemMatch: {productId: productId}}})
  }
  async add(cartId, productId, quantity) {
    return await this.model.findOneAndUpdate(
      {_id: cartId},
      {$addToSet:{ products: { productId, quantity } } },
      {new: true}
      )
  }
  async remove(cartId, productId ) {
    return await this.model.findOneAndUpdate(
      {_id: cartId},
      {$pull: {products: { productId } } },
      {new: true})
  }

  async removeAll(cartId) {
      return await this.model.updateOne(
        {_id: cartId},
        {$set: { products: [] }}
      )
  }

  async updateQuantity(cartId, productId, quantity) {
    return await this.model.updateOne(
      { _id: cartId, 'products.productId': productId },
      { $inc: { 'products.$.quantity': quantity } }
    )
  }
  
  async update(cartId, products) {
    return await this.model.updateOne(
      { _id: cartId },
      { $set: { products: products } }
    )
  }

}
module.exports = CartDaoMongo;

