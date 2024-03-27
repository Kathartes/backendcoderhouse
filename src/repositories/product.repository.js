

class ProductRepository {
    constructor(dao) {
        this.dao = dao 
    }
    getProduct = async () => await this.dao.get()
    
    getProductByFilter = async (filter) => await this.dao.getBy(filter) 

    createProduct = async (product) => await this.dao.create(product)

    updateProduct = async (pId, updateProduct) => await this.dao.update(pId, updateProduct)

    deleteProduct = async (pId) => await this.dao.delete(pId)
}

module.exports = {ProductRepository }