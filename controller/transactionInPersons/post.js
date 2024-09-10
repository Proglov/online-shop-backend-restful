const { TransActionInPerson, Product } = require('../../models/dbModels');
const mongoose = require('mongoose');


const TransActionInPersonCreate = async (args, context) => {
    const { boughtProducts, userId } = args;
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
                $addFields: {
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
                    quantity: "$totalBoughtData.quantity",
                    off: "$totalBoughtData.off",
                },
            },
        ]);

        //check if we have enough product
        for (const product of products) {
            if (!product?.count || product?.count < product?.quantity)
                return {
                    transactionId: null,
                    message: `product is not available. Maximum: ${product.count || 0}, ProductName: ${product.name}`,
                    status: 409
                }
        }

        let totalPrice = products.reduce((acc, currentProduct) => acc + currentProduct.price * currentProduct.quantity * (1 - currentProduct.off / 100), 0)

        const newTransActionInPerson = new TransActionInPerson({
            userId,
            totalPrice,
            boughtProducts,
        });

        await newTransActionInPerson.save();


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
            transActionId: newTransActionInPerson?._id,
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
    TransActionInPersonCreate
}