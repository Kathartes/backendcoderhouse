const { productModel } = require('./models/products.model')

class ProductDaoMongo {
    constructor(){
        this.model = productModel;
    }
    async get(){
        return await this.model.find();
    }
    async getBy(filter){
        return await this.model.findOne(filter);
    }
    async create(product){
        return await this.model.create(product)
    }
    async update(pId, updatedProduct){
        return await this.model.findOneAndUpdate({_id: pId},{$set: updatedProduct},{new: true})
    }
    async delete(pId){
        return await this.model.findByIdAndDelete(pId)
    }
}
module.exports = ProductDaoMongo;