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
        const admin = await Admin.findOne({ $where: `this.userId == '${userId}'` });
        const truthy = !!admin;
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

const encString = str => {
    if (typeof str !== "string") return null
    let res = []
    for (let i = 0; i < str.length; i++) {
        if (i % 2 === 0) {
            res[i + 1] = str[i]
        } else {
            res[i - 1] = str[i]
        }
    }
    return res.join("")
}

const extractSellerIdFromFilename = str => {
    if (typeof str !== "string") return null
    let res = []
    for (let i = 0; i < str.length; i++) {
        if (str[i] === "_") {
            for (let j = i + 1; j < str.length; j++) {
                if (str[j] === "_") break
                res.push(str[j])
            }
            break
        }
    }
    return encString(res.join(""))
}

module.exports = {
    getUserFromToken,
    isAdmin,
    isPhoneValid,
    isWorkingPhoneValid,
    isEmailValid,
    encString,
    extractSellerIdFromFilename
}