const { productService } = require('../repositories/services')

class ProductController{
    constructor(){
        this.productService = productService   
    }
   /* async getProductsX(req,res){
    }*/

    getProducts = async(req,res)=>{ 
        try{
            const result = await this.productService.getProduct();
            res.json({result})
        }
        catch(error){
            res.status(500).send('Error al encontrar los productos ')
        }
      
    }
    
    getProductByFilter = async(req,res)=>{
        try{
        const { filter } = req.params;
        const productFound = await this.productService.getProductByFilter(filter);
        res.json({productFound})
        }
        catch(error){
            res.status(500).send('Error al encontrar el producto')
        }
    }
    createProduct = async(req,res)=> {
        try{
        const { title, description, price, code, stock, category, owner } = req.body;
            console.log(title, description, price, code, stock, category, owner )
        let updatedOwner = owner;
            if(owner === 'adminCoder@coder.com') {
                updatedOwner ='Admin'
            }

        const thumbnails = req.files.map(file => `/files/products/${file.filename}`);   

        const newProduct = await this.productService.createProduct({
            title, 
            description, 
            code, 
            price, 
            stock, 
            category, 
            owner: updatedOwner,
            thumbnails
        });
        res.json({ product: newProduct })
        }
        catch(error){
            res.status(500).send('Error al crear el producto')
        }
    }
    updateProduct = async(req,res)=>{
        try{
        console.log(req.params.pId, req.body)
        const productId = req.params.pId;
        const updatedProduct = await this.productService.updateProduct(productId, req.body);
        res.json({product: updatedProduct})
        }
        catch(error){
            res.status(500).send('Error al modificar el producto')
        }
    }
    deleteProduct = async(req,res)=>{
        try {
        const productId = req.params.pId;
        const deletedProduct = await this.productService.deleteProduct(productId);
        res.json({deletedProduct})
        }
        catch(error){
            res.status(500).send('Error al borrar el producto')
        }
    }
}

module.exports = ProductController