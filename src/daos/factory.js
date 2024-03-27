const { configObject } = require ('../config/index')

let UserDao
let ProductDao
let CartDao
let MessageDao
let TicketDao


switch( configObject.persistence) {
    case 'MONGO':
        const UserDaoMongo = require('./mongo/usersManagerMongo')
        UserDao = UserDaoMongo

        const ProductDaoMongo = require('./mongo/productsManagerMongo')
        ProductDao = ProductDaoMongo

        const CartDaoMongo = require('./mongo/cartsManagerMongo')
        CartDao = CartDaoMongo 

        /*const MessageDaoMongo = require('./mongo/messageManagerMongo')//crear
        MessageDao = MessageDaoMongo*/

        /*const TicketDaoMongo = require('./mongo/ticketManagerMongo')//crear
        TicketDao = TicketDaoMongo*/

    break;

    default:
        break;
}

module.exports = {
    UserDao,
    ProductDao,
    CartDao,
    MessageDao,
    TicketDao
}

