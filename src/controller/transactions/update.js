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

        if (newStatus !== 'Received' && newStatus !== 'Sent') return {
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
            message: "TransAction is successfully Updated",
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

const CancelTXByUser = async (args, context) => {
    const { id, reason } = args
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

        if (!reason || typeof reason !== 'string') return {
            transaction: null,
            message: "Reason is required",
            status: 400
        }

        const tx = await TransAction.findById(id).populate({ path: "boughtProducts.productId" }).select('status userId')

        if (!tx) return {
            transaction: null,
            message: "No transaction found!",
            status: 404
        }

        if (tx.status !== 'Requested') return {
            transaction: null,
            message: "Transaction can not be canceled",
            status: 400
        }

        if (tx.userId != userInfo?.userId && !(await isAdmin(userInfo.userId))) return {
            transaction: null,
            message: "You are not authorized!",
            status: 403
        }

        tx.status = 'Canceled';
        tx.canceled = {
            canceledBy: 'user',
            reason,
        }

        tx.save();

        return {
            transaction: { ...tx._doc },
            message: "TransAction is successfully canceled",
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

const CancelTXBySeller = async (args, context) => {
    const { id, reason } = args
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo || !userInfo?.userId) return {
            transaction: null,
            message: "You are not authorized!",
            status: 403
        }

        if (!reason || typeof reason !== 'string') return {
            transaction: null,
            message: "Reason is required",
            status: 400
        }

        const tx = await TransAction.findById(id).populate({ path: "boughtProducts.productId", select: 'sellerId status' })

        if (!tx) return {
            transaction: null,
            message: "No transaction found!",
            status: 404
        }

        if (tx.status !== 'Requested') return {
            transaction: null,
            message: "Transaction can not be canceled",
            status: 400
        }

        if (tx.boughtProducts[0].productId.sellerId != userInfo?.userId && !(await isAdmin(userInfo.userId))) return {
            transaction: null,
            message: "You are not authorized!",
            status: 403
        }

        tx.status = 'Canceled';
        tx.canceled = {
            canceledBy: 'seller',
            reason,
        }

        tx.save();

        return {
            transaction: { ...tx._doc },
            message: "TransAction is successfully canceled",
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

const OpinionTX = async (args, context) => {
    const { id, rate, comment } = args
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

        if (!(!comment || typeof comment !== 'string') && !(!rate || !([1, 2, 3, 4, 5].includes(rate)))) return {
            transaction: null,
            message: "نظر یا ستاره الزامیست",
            status: 400
        }

        const tx = await TransAction.findById(id).populate({ path: "boughtProducts.productId" })

        if (!tx) return {
            transaction: null,
            message: "No transaction found!",
            status: 404
        }

        if (tx.userId != userInfo?.userId && !(await isAdmin(userInfo.userId))) return {
            transaction: null,
            message: "You are not authorized!",
            status: 403
        }

        tx.opinion = {
            rate,
            comment
        };

        tx.save();

        return {
            transaction: { ...tx._doc },
            message: "TransAction is successfully rated",
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
    TransActionStatus,
    CancelTXByUser,
    CancelTXBySeller,
    OpinionTX
}