class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTicket = async (ticket) => await this.dao.create(ticket)
    
    getTicket =  async (filter) => await this.dao.getBy(filter)

    get = async () => await this.dao.get()
   
}

module.exports = { TicketRepository }