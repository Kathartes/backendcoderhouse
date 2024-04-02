const { UserDao, ProductDao, CartDao, MessageDao, TicketDao } = require('../daos/factory')
const { ProductRepository } = require('./product.repository')
const { UserRepository } = require('./user.repository')
const { CartRepository } = require('./cart.repository')
//const { MessageRepository } = require('../repositories/message.repository')
const { TicketRepository } = require('../repositories/ticket.repository')


const productService = new ProductRepository(new ProductDao())
const cartService = new CartRepository(new CartDao())
const userService = new UserRepository(new UserDao())
//const messageService = new MessageRepository(new MessageDao())
const ticketService = new TicketRepository(new TicketDao())

module.exports ={
    productService,
    cartService,
    userService,
    //messageService,
    ticketService
}