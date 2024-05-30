const JWT = require('jsonwebtoken');
const { Admin } = require('../models/dbModels');

const getUserFromToken = token => {
    try {
        return JWT.verify(token, process.env.JWT_SIGNATURE)
    } catch (error) {
        null
    }
}

async function isAdmin(userId) {
    try {
        const all = await Admin.find();
        const ids = [];
        all.map(admin => {
            ids.push(admin.userId)
        })
        const truthy = ids.some((id) => {
            return id == userId
        })
        return truthy;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

const isPhoneValid = phone => {
    const regex = /^09\d{9}$/;
    return regex.test(phone)
}

const isWorkingPhoneValid = phone => {
    const regex = /^0\d{2,3}\d{8}$/;
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
    isWorkingPhoneValid,
    isEmailValid,
}