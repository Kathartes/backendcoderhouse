const { ticketModel } = require('./models/ticket.model')

class ticketDaoMongo {
    constructor (){
        this.model = ticketModel
    }
    async get(){
        return await this.model.find();
    }
    async getBy(filter){
        return await this.model.findOne(filter);
    }
    async create(ticket){
        return await this.model.create(ticket);
    } 
    async getById(id) {
        return await this.model.findById(id);
    }

}

module.exports = ticketDaoMongo;

