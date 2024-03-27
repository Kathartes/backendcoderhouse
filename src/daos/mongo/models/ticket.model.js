const { Schema, model } = require('mongoose');

const ticketCollection = "Ticket";

const ticketSchema = Schema({
    
    code: {
        type: String,
        require: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: number,
        required: true,
    },
    purchaser: {
        type: string,
        required: true
    },

})

const ticketModel = model(ticketCollection, ticketSchema)

module.exports = {ticketModel}







/*codigo

Fecha 

quiencomproeso 

preciototal
*/
