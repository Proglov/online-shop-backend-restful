const { TransAction, Product } = require('../../models/dbModels');


const TransActionCreate = async (args, context) => {
    const { shippingCost, boughtProducts, address, shouldBeSentAt } = args;

    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 403
            }
        }

        if (!boughtProducts?.length) {
            return {
                message: "boughtProduct is required",
                status: 400
            }
        }

        let totalPrice = 0;

        for (let i = 0; i < boughtProducts.length; i++) {
            const thisProduct = await Product.findById(boughtProducts[i].productId);
            const thisPrice = thisProduct.price * boughtProducts[i].quantity
            totalPrice += thisPrice
        }

        const newTransAction = new TransAction({
            userId: userInfo.userId,
            shippingCost,
            totalPrice,
            boughtProducts,
            address,
            shouldBeSentAt
        });

        await newTransAction.save();

        return {
            message: "TransAction is successfully added",
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
    TransActionCreate
}