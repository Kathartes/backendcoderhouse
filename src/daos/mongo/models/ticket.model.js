const { Schema, model } = require('mongoose');

const ticketCollection = "Ticket";

const ticketSchema = Schema({
    
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
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
