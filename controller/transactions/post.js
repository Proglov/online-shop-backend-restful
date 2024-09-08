const { TransAction, Product } = require('../../models/dbModels');
const { extractCoupon } = require('../../lib/Functions');
const { verifyCompanyCouponForSomeProductsToken, getOneCompanyCouponForSomeProducts } = require('../festivals/companyCouponSomeProducts/serverActions');
const mongoose = require('mongoose');


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

        const products = await Product.aggregate([
            {
                $match: {
                    _id: { $in: boughtProducts.map(obj => new mongoose.Types.ObjectId(obj.productId)) },
                },
            },
            {
                $lookup: {
                    from: 'festivals',
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $in: ["festival", {
                                                $map: {
                                                    input: boughtProducts,
                                                    as: "bp",
                                                    in: {
                                                        $cond: [
                                                            { $eq: ["$$bp.productId", { $toString: "$$id" }] },
                                                            "$$bp.which",
                                                            null
                                                        ]
                                                    }
                                                }
                                            }]
                                        },
                                        {
                                            $eq: ["$$id", "$productId"]
                                        }
                                    ]
                                }
                            },
                        }
                    ],
                    as: 'festivalDetails',
                },
            },
            {
                $lookup: {
                    from: 'majorshoppings',
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $in: ["major", {
                                                $map: {
                                                    input: boughtProducts,
                                                    as: "bp",
                                                    in: {
                                                        $cond: [
                                                            { $eq: ["$$bp.productId", { $toString: "$$id" }] },
                                                            "$$bp.which",
                                                            null
                                                        ]
                                                    }
                                                }
                                            }]
                                        },
                                        {
                                            $eq: ["$$id", "$productId"]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'majorShoppingDetails',
                },
            },
            {
                $addFields: {
                    festivalOffPercentage: { $arrayElemAt: ["$festivalDetails.offPercentage", 0] },
                    until: { $arrayElemAt: ["$festivalDetails.until", 0] },
                    majorShoppingOffPercentage: { $arrayElemAt: ["$majorShoppingDetails.offPercentage", 0] },
                    majorQuantity: { $arrayElemAt: ["$majorShoppingDetails.quantity", 0] },
                    totalBoughtData: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: boughtProducts,
                                    as: 'bp',
                                    cond: { $eq: ['$$bp.productId', { $toString: '$_id' }] },
                                },
                            },
                            0
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    sellerId: 1,
                    count: 1,
                    name: 1,
                    price: 1,
                    festivalOffPercentage: 1,
                    until: 1,
                    majorShoppingOffPercentage: 1,
                    majorQuantity: 1,
                    quantity: "$totalBoughtData.quantity"
                },
            },
        ]);

        //check if we have enough product
        for (const product of products) {
            if (!product?.count || product?.count < product?.quantity)
                return {
                    transactionId: null,
                    message: `product is not available. Maximum: ${product.count}, ProductName: ${product.name}`,
                    status: 409
                }
        }


        let totalDiscount = 0
        let totalPrice = products.reduce((acc, currentProduct) => {
            const thisPrice = currentProduct.price * currentProduct.quantity
            if (currentProduct?.majorShoppingOffPercentage > 0 && currentProduct?.quantity >= currentProduct?.majorQuantity)
                totalDiscount += thisPrice * currentProduct.majorShoppingOffPercentage / 100
            else if (currentProduct?.festivalOffPercentage > 0 && currentProduct?.until >= Date.now())
                totalDiscount += thisPrice * currentProduct.festivalOffPercentage / 100
            return acc + thisPrice
        }, 0)


        //  handled the code discount
        const tokenRes = await verifyCompanyCouponForSomeProductsToken({ token: discountToken })
        const couponType = extractCoupon(tokenRes?.body)

        if (couponType === "CompanyCouponForSomeProducts") {
            const discount = await getOneCompanyCouponForSomeProducts({ body: tokenRes?.body })

            if (!!discount && totalPrice >= discount?.minBuy) {
                const totalPriceOfDiscountedWithCodeProducts = products.reduce((acc, currentProduct) => {
                    const currentIndex = discount.productsIds.findIndex(id => id.equals(new mongoose.Types.ObjectId(currentProduct._id)))
                    if (currentIndex >= 0)
                        return acc + (currentProduct.price * currentProduct.quantity)
                    return acc
                }, 0)

                totalDiscount += Math.min((totalPriceOfDiscountedWithCodeProducts * discount.offPercentage / 100), discount?.maxOffPrice)
            }
        }

        totalPrice -= totalDiscount

        //shippingCost should be handled properly
        const shippingCost = 50000
        totalPrice += shippingCost;


        const newTransAction = new TransAction({
            userId: userInfo.userId,
            shippingCost,
            totalPrice,
            boughtProducts,
            address,
            shouldBeSentAt,
            totalDiscount: totalDiscount > 0 ? totalDiscount : undefined
        });

        await newTransAction.save();


        //decrease the products count
        const bulkOps = products.map(product => {
            return {
                updateOne: {
                    filter: { _id: product._id },
                    update: { $inc: { count: -product.quantity } }
                }
            };
        });

        await Product.bulkWrite(bulkOps);


        return {
            transactionId: 'newTransAction?._id',
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