const { isAdmin } = require('../../lib/Functions');
const { TransAction } = require('../../models/dbModels');


const TransActionDone = async (args, context) => {
    const { id } = args
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo || !userInfo?.userId) {
            return {
                transaction: null,
                message: "You are not authorized!",
                status: 403
            }
        }

        const tx = await TransAction.findById(id).populate({ path: "boughtProducts.productId", select: 'sellerId name' }).populate({ path: "userId", select: 'name phone' })

        if (!tx) return {
            transaction: null,
            message: "No transaction found!",
            status: 404
        }

        if (tx.boughtProducts[0].productId.sellerId != userInfo?.userId && !(await isAdmin(userInfo.userId))) return {
            transaction: null,
            message: "You are not authorized!",
            status: 403
        }

        tx.done = true;

        tx.save();

        return {
            transaction: { ...tx._doc },
            message: "TransAction is successfully done",
            status: 202
        }


    } catch (error) {
        return {
            transaction: null,
            message: error,
            status: 500
        }
    }
}

module.exports = {
    TransActionDone
}