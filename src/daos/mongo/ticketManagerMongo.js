const { ticketModel } = require('./models/ticket.model')

class ticketDaoMongo {
    constructor (){
        this.model = ticketModel
    }
    async get(){
        return await this.model.find();
    }
    async getBy(){
        return await this.model.find(filter);
    }
    async create(ticket){
        return await this.model.create(ticket);
    } 
}

module.exports = ticketDaoMongo;
