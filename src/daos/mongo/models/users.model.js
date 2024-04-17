const { Schema, model, Types } = require ('mongoose');

const userCollection = 'Users';

const userSchema = Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
      },
      last_name: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      password: {
        type: String,
        required: true,
        trim: true
      },
      age:{
        type: Number,
        required: true,
        trim: true
      },
      cart: {
        type: Types.ObjectId, ref: 'Carts',
      },
      role: {
        type: String,
        required: true
      },
      documents: [{
        name: { type: String },
        reference: { type: String }
      }],
      last_connection: {
        type: Date,
        default: Date.now
      },
      profile: {
        type: String,
        trim: true,
        default: ''
      },
      status: {
        type: Boolean,
        default: false
      }
})


const userModel = model(userCollection, userSchema);

module.exports = { userModel};