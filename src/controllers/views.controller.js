const { userService, productService, messageService, cartService } = require('../repositories/services')
const { configObject } = require('../config/index')
const jwt = require('jsonwebtoken')




class ViewsController{
    constructor() {
        this.userService = userService
        this.productService = productService
        this.messageService = messageService 
        this.cartService = cartService
    }
    products = async (req, res) => {
        const products = await this.productService.getProduct();
        const token = req.cookies.token
        


        if (!token){
            return res.redirect("/login")
        }
        const decodedToken = jwt.verify(token, configObject.jwt_secret_key )
        const cartId = decodedToken.cartId
        const cart = await this.cartService.getCart(cartId);

        res.render('products', { title: 'products', style: 'manager.css', body: 'products', products, user:decodedToken, cart});  

    }
    users = async (req, res) => {
        const users = await this.userService.getUser();
        res.render('users', { title: 'Users', style: 'users.css', body: 'users', users });
    }

    login = async (req, res) => {  
        res.render('login', { title: 'Login', style: 'login.css', body: 'login' });
    }

    register = async (req, res) => {
        res.render('register', { title: 'Register', style: 'login.css', body: 'register' });
    }
    manager = async (req, res) => {
        const products = await this.productService.getProduct();
        const token = req.cookies.token
        if (!token){
            return res.redirect("/login")
        }
        const decodedToken = jwt.verify(token, configObject.jwt_secret_key )
        res.render('manager', { title: 'manager', style: 'manager.css', body: 'manager', products, user: decodedToken});
    }
    role = async (req, res) => {

        const token = req.cookies.token
        if (!token){
            return res.redirect("/login")
        }
        const decodedToken = jwt.verify(token, configObject.jwt_secret_key )
        res.render('role', { title: 'role', style: 'manager.css', body: 'role', user: decodedToken });
    }
}

module.exports = ViewsController