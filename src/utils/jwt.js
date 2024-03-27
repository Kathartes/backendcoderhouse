const jwt = require('jsonwebtoken')
const {configObject } = require("../config/index")
const JWT_PRIVATE_KEY = configObject.jwt_secret_key

const createToken = user => jwt.sign(user, JWT_PRIVATE_KEY, {expiresIn: '1d'})

module.exports = {
    createToken, 
    JWT_PRIVATE_KEY
}