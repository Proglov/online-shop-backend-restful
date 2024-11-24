const mongoose = require('mongoose');
const { TransActionInPerson, Product, UserInPerson } = require('../../models/dbModels');


const TransActionInPersonCreate = async (args, context) => {
    const { boughtProducts, userId } = args;
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

        if (!userId) {
            return {
                transaction: null,
                message: "userId is required",
                status: 400
            }
        }

        if (!boughtProducts?.length) {
            return {
                transaction: null,
                message: "boughtProduct is required",
                status: 400
            }
        }

        const user = await UserInPerson.findById(userId)

        if (!user || !user?.sellerId.equals(new mongoose.Types.ObjectId(userInfo?.userId))) return {
            transaction: null,
            message: "user is required",
            status: 400
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
                    transaction: null,
                    message: `از محصول ${product.name} به مقدار ${product.count || 0} عدد در انبار موجود است`,
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
            transaction: {
                _id: newTransActionInPerson?._id,
                userId: {
                    name: user.name,
                    phone: user.phone
                },
                totalPrice,
                boughtProducts: boughtProducts.map(bp => ({
                    _id: bp._id,
                    off: bp.off,
                    quantity: bp.quantity,
                    productId: {
                        _id: bp.productId,
                        name: (products.find(product => product._id.equals(bp.productId))).name
                    }
                })),
                createdAt: Date.now()
            },
            message: "TransAction is successfully added",
            status: 200
        }


    } catch (error) {
        console.log(error);
        return {
            transaction: null,
            message: error,
            status: 500
        }
    }
}

module.exports = {
    TransActionInPersonCreate
}