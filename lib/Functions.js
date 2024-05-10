const JWT = require('jsonwebtoken');
const { Admin } = require('../models/dbModels');

const getUserFromToken = token => {
    try {
        return JWT.verify(token, process.env.JWT_SIGNATURE)
    } catch (error) {
        null
    }
}

const isAdmin = async (id) => {
    const admin = await Admin.findOne({ userId: id });
    return !!admin;
}

const isPhoneValid = phone => {
    const regex = /^09\d{9}$/;
    return regex.test(phone)
}

const isEmailValid = email => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return regex.test(email)
}

module.exports = {
    getUserFromToken,
    isAdmin,
    isPhoneValid,
    isEmailValid
}