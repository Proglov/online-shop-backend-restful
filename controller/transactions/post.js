const { TransAction, Product } = require('../../models/dbModels');
const { extractCoupon } = require('../../lib/Functions');
const { verifyCompanyCouponForSomeProductsToken, getOneCompanyCouponForSomeProducts } = require('../festivals/companyCouponSomeProducts/serverActions');


const TransActionCreate = async (args, context) => {
    const { discountToken, boughtProducts, address, shouldBeSentAt } = args;

    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo || !userInfo?.userId) {
            return {
                transactionId: null,
                message: "You are not authorized!",
                status: 403
            }
        }

        if (!boughtProducts?.length) {
            return {
                transactionId: null,
                message: "boughtProduct is required",
                status: 400
            }
        }

        const products = await Product.find({
            _id: {
                $in: boughtProducts?.map(obj => obj.productId)
            }
        })
        let totalDiscount = 0
        let totalPrice = boughtProducts.reduce((acc, currentProduct) => {
            const productIndex = products.findIndex(prod => prod._id == currentProduct.productId)
            return acc + (products[productIndex].price * currentProduct.quantity)
        }, 0)


        //  handled the discount
        const tokenRes = await verifyCompanyCouponForSomeProductsToken({ token: discountToken })

        const couponType = extractCoupon(tokenRes?.body)

        if (couponType === "CompanyCouponForSomeProducts") {
            const discount = await getOneCompanyCouponForSomeProducts({ body: tokenRes?.body })

            if (!!discount && totalPrice >= discount?.minBuy) {
                const totalDiscountedProducts = boughtProducts.reduce((acc, currentProduct) => {
                    const currentIndex = discount.productsIds.findIndex(id => id === currentProduct.productId)
                    if (currentIndex >= 0)
                        return acc + (currentProduct.price * currentProduct.quantity)
                    return acc
                }, 0)

                totalDiscount = Math.min((totalDiscountedProducts * discount.offPercentage / 100), discount?.maxOffPrice)

                totalPrice -= totalDiscount
            }
        }


        //shippingCost should be handled properly
        const shippingCost = 0
        totalPrice += shippingCost;



        const newTransActionObj = {
            userId: userInfo.userId,
            shippingCost,
            totalPrice,
            boughtProducts,
            address,
            shouldBeSentAt,
            totalDiscount: totalDiscount > 0 ? totalDiscount : undefined
        }

        const newTransAction = new TransAction(newTransActionObj);

        await newTransAction.save();

        return {
            transactionId: newTransAction?._id,
            message: "TransAction is successfully added",
            status: 200
        }


    } catch (error) {
        return {
            transactionId: null,
            message: error,
            status: 500
        }
    }
}

module.exports = {
    TransActionCreate
}