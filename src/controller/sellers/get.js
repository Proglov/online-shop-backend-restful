const { Seller } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');

const getMeSeller = async (_args, context) => {
    const { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }

        const seller = await Seller.findById(userInfo?.userId).select('-password').lean().exec();
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
    const { id } = args;
    if (!id) {
        return {
            product: null,
            message: "seller ID is required",
            status: 400,
        };
    }

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                seller: null,
                message: "You are not authorized!",
                status: 400
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

        const seller = await Seller.findById(id).select('-password').lean().exec();

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
    const { page, perPage, validated } = args;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                sellers: null,
                allSellersCount: 0,
                message: "You are not authorized!",
                status: 400
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

        const condition = {}
        const skip = (page - 1) * perPage;

        if (!!validated && validated === "true") condition.validated = true
        else if (!!validated && validated === "false") condition.validated = false

        const query = Seller.find(condition).select('-password').skip(skip).limit(perPage)

        let allSellersCount = 0
        const sellers = await query.lean().exec();

        if (!skip && skip !== 0) allSellersCount = sellers.length
        else allSellersCount = await Seller.where(condition).countDocuments().exec();

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
        if (!userInfo || !userInfo?.userId) {
            return {
                isSeller: null,
                message: "You are not authorized!",
                status: 400
            }
        }

        const seller = await Seller.findById(userInfo?.userId).lean().exec()

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