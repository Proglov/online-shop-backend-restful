const { Seller } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');

const getMeSeller = async (_args, context) => {

    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            return {
                seller: null,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        const seller = await Seller.findById(userInfo?.userId).select('-password');
        return {
            seller,
            status: 200,
            message: null
        }


    } catch (error) {
        return {
            seller: null,
            status: 500,
            message: error
        }
    }

}

const getSeller = async (args, context) => {

    const { userInfo } = context;
    let { id } = args;


    try {
        //check if req contains token
        if (!userInfo) {
            return {
                seller: null,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        //only admin can get the sellers
        if (!(await isAdmin(userInfo.userId))) {
            return {
                seller: null,
                status: 403,
                message: "You Are Not Authorized"
            }
        }

        const seller = await Seller.findById(id)

        return {
            seller,
            status: 200,
            message: null
        }


    } catch (error) {
        return {
            seller: null,
            status: 500,
            message: error
        }
    }

}

const getSellers = async (args, context) => {

    const { userInfo } = context;
    let { page, perPage, validated } = args;

    try {
        //check if req contains token
        if (!userInfo) {
            return {
                sellers: null,
                allSellersCount: 0,
                status: 400,
                message: "You Are Not Authorized"
            }
        }
        //only admin can get the users
        if (!(await isAdmin(userInfo.userId))) {
            return {
                sellers: null,
                allSellersCount: 0,
                status: 403,
                message: "You Are Not Authorized"
            }
        }

        //get all of them if validated is not specified
        if ((validated == undefined || validated == null) && validated !== false) {
            const allSellersCount = await Seller.where().countDocuments().exec();
            if (!page || !perPage) {
                const sellers = await Seller.find({}).select('-password');
                return {
                    sellers,
                    allSellersCount,
                    status: 200,
                    message: null
                }
            }

            const skip = (page - 1) * perPage;
            const sellers = await Seller.find({}).select('-password').skip(skip).limit(perPage);
            return {
                sellers,
                allSellersCount,
                status: 200,
                message: null
            }

        }

        //if validated is true
        if (validated === "true") {
            const allSellersCount = await Seller.where({ validated: true }).countDocuments().exec();
            if (!page || !perPage) {
                const sellers = await Seller.find({ validated: true }).select('-password');
                return {
                    sellers,
                    allSellersCount,
                    status: 200,
                    message: null
                }
            }

            const skip = (page - 1) * perPage;
            const sellers = await Seller.find({ validated: true }).select('-password').skip(skip).limit(perPage);
            return {
                sellers,
                allSellersCount,
                status: 200,
                message: null
            }
        }

        //if validated is false
        const allSellersCount = await Seller.where({ validated: false }).countDocuments().exec();
        if (!page || !perPage) {
            const sellers = await Seller.find({ validated: false }).select('-password');
            return {
                sellers,
                allSellersCount,
                status: 200,
                message: null
            }
        }
        const skip = (page - 1) * perPage;
        const sellers = await Seller.find({ validated: false }).select('-password').skip(skip).limit(perPage);
        return {
            sellers,
            allSellersCount,
            status: 200,
            message: null
        }


    } catch (error) {
        return {
            sellers: null,
            allSellersCount: 0,
            status: 500,
            message: error
        }
    }

}

const isUserSeller = async (_args, context) => {

    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            return {
                status: 400,
                isSeller: null,
                message: 'you are not authorized'
            }
        }

        const seller = await Seller.findById(userInfo?.userId)

        return {
            status: 200,
            isSeller: !!seller,
            message: null
        }


    } catch (error) {
        return {
            status: 500,
            isSeller: null,
            message: error
        }
    }

}

module.exports = {
    getMeSeller,
    getSeller,
    getSellers,
    isUserSeller
}