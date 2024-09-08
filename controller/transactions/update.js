const { isAdmin } = require('../../lib/Functions');
const { TransAction } = require('../../models/dbModels');


const TransActionStatus = async (args, context) => {
    const { id, newStatus } = args
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

        if (newStatus !== 'Received' && newStatus !== 'Sent' && newStatus !== 'Canceled') return {
            transaction: null,
            message: "status is not acceptable",
            status: 400
        }

        const tx = await TransAction.findById(id).populate({ path: "boughtProducts.productId", select: 'sellerId' })

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

        tx.status = newStatus;

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
    TransActionStatus
}