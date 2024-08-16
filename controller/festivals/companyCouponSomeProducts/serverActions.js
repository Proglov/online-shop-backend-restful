const JWT = require('jsonwebtoken');
const { CompanyCouponForSomeProducts } = require('../../../models/dbModels');


const verifyCompanyCouponForSomeProductsBody = async (args, context) => {
    const { body } = args;
    const { userInfo } = context //userInfo should be already checked in getTokenFromBodyCompanyCouponForSomeProducts function

    try {

        const existingCompanyCouponForSomeProducts = await CompanyCouponForSomeProducts.findOne({ body })

        if (!existingCompanyCouponForSomeProducts) return {
            message: 'Body is Not Valid!',
            status: false
        }
        if (existingCompanyCouponForSomeProducts?.remainingCount == 0) return {
            message: 'No room any more!',
            status: false
        }

        const userIndex = existingCompanyCouponForSomeProducts.usersIds.findIndex(id => id == userInfo?.userId)

        if (userIndex >= 0) return {
            message: 'Already entered this code!',
            status: false
        }

        else {
            existingCompanyCouponForSomeProducts.remainingCount = existingCompanyCouponForSomeProducts.remainingCount - 1
            existingCompanyCouponForSomeProducts.usersIds.push(userInfo?.userId)
            await existingCompanyCouponForSomeProducts.save()

            updatedOrDeleted = 'Updated'
        }


        return {
            message: 'You are Welcome!',
            status: true
        }

    } catch (error) {
        console.log(error);

        return {
            message: error,
            status: false
        }
    }
}


const verifyCompanyCouponForSomeProductsToken = async (args, _context) => {
    const { token } = args;
    try {
        if (!token) return null
        return JWT.verify(token, process.env.JWT_SIGNATURE)
    } catch (error) {
        return null
    }
}

const getOneCompanyCouponForSomeProducts = async (args, _context) => {
    try {
        const { body } = args;
        const res = await CompanyCouponForSomeProducts.findOne({ body }).select('productsIds minBuy maxOffPrice offPercentage')
        return res
    } catch (error) {
        return null
    }
}


module.exports = {
    verifyCompanyCouponForSomeProductsBody,
    verifyCompanyCouponForSomeProductsToken,
    getOneCompanyCouponForSomeProducts
}