const { TransAction } = require('../../models/dbModels');


const TransActionDone = async (args, context) => {
    const { id } = args
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 403
            }
        }

        const tx = await TransAction.findById(id).populate({ path: "boughtProducts.productId", select: 'sellerId' })
        if (tx.boughtProducts[0].productId.sellerId != userInfo?.userId) return {
            message: "You are not authorized!",
            status: 403
        }

        tx.done = true;

        tx.save();

        return {
            message: "TransAction is successfully done",
            status: 200
        }


    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }
}

module.exports = {
    TransActionDone
}