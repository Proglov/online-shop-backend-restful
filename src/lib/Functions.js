const JWT = require('jsonwebtoken');
const { Admin } = require('../models/dbModels');

const generateRandomString = length => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const getUserFromToken = token => {
    try {
        return JWT.verify(token, process.env.JWT_SIGNATURE)
    } catch (error) {
        null
    }
}

const isAdmin = async (userId) => {
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

const getCoupon = str => {
    if (typeof str !== "string") return null

    const randomGeneratedStr = generateRandomString(5)

    let couponCode;
    switch (str) {
        case "CompanyCouponForSomeProducts":
            couponCode = "CCP"
            break;
        default:
            throw new Error("input is not a valid coupon!")
    }

    let res = randomGeneratedStr.slice(0, 1) + couponCode[0] + randomGeneratedStr.slice(1);
    res = res.slice(0, 4) + couponCode[1] + res.slice(4);
    res = res.slice(0, 6) + couponCode[2] + res.slice(6);

    return res
}

const extractCoupon = str => {
    if (typeof str !== "string") return null

    if (str[1] === "C" && str[4] === "C" && str[6] === "P")
        return "CompanyCouponForSomeProducts"

    return null
}

const getField = (field, type) => {
    let res
    switch (type) {
        case 'int':
            res = parseInt(field)
            break;
        case 'posInt':
            res = Math.abs(parseInt(field))
            break;
        case 'float':
            res = parseFloat(field)
            break;
        default:
            res = field
    }
    return res
}

const getQueryArgs = (args, options) => {
    const obj = {}
    Object.keys(options).map(key => {
        obj[key] = getField(args[key], options[key])
    })
    return obj
}

module.exports = {
    generateRandomString,
    getUserFromToken,
    isAdmin,
    isPhoneValid,
    isWorkingPhoneValid,
    isEmailValid,
    encString,
    extractSellerIdFromFilename,
    getCoupon,
    extractCoupon,
    getQueryArgs
}