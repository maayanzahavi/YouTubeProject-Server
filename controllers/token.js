const userService = require('../services/user.js')
const tokenModel = require('../models/token.js')

//check if the login was succesful
async function processLogin(req, res) {
    const email = req.body.username
    const password = req.body.password
    if (await userService.isSigned(email, password) == false) {
        res.status(404).json( { error: 'Invalid username and/or password' } )
    } else {
        res.status(201).json( { token: tokenModel.getToken(req) } )
    }
}

module.exports = { processLogin }