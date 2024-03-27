const { Schema, model } = require('mongoose');


const productsCollection = "Products";

const productsSchema = Schema({
    
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: { 
        type: Boolean, 
        default: true 
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        
    },
    thumbnails: {
        type: Array
    }
})


const productModel = model(productsCollection, productsSchema);

module.exports = { productModel}