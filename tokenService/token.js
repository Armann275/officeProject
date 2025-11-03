const jwt = require('jsonwebtoken');
require('dotenv').config();

function getToken(userDto){
    const token = jwt.sign(userDto, 'secret');
    return token;
}

module.exports = {getToken}