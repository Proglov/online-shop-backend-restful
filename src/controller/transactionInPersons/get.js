const mongoose = require('mongoose');
const { TransActionInPerson, Product } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const getAllTransActionInPersons = async (args, context) => {
    const { userInfo } = context;
    const { page, perPage } = args;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                transactions: null,
                transactionsCount: 0,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        //only admin can get the transactions
        if (!(await isAdmin(userInfo.userId))) {
            return {
                transactions: null,
                transactionsCount: 0,
                status: 403,
                message: "You Are Not Authorized"
            }
        }

        const skip = (page - 1) * perPage;

        const query = TransActionInPerson.find().populate({ path: "userId", select: 'name phone' }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage)

        let count = 0
        const tx = await query.lean().exec();

        if (!skip && skip !== 0) count = tx.length
        else count = await TransActionInPerson.where().countDocuments().exec();

        return {
            transactions: tx,
            transactionsCount: count,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            transactions: null,
            transactionsCount: 0,
            status: 500,
            message: error
        }
    }
}


const getAllTransActionInPersonsOfASeller = async (args, context) => {
    const { id, page, perPage } = args;
    const { userInfo } = context;
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
                transactions: null,
                transactionsCount: 0,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        const conditionQuery = [
            { $unwind: '$boughtProducts' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'boughtProducts.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $match: {
                    'productDetails.sellerId': new mongoose.Types.ObjectId(id)
                }
            },
            { $sort: { createdAt: -1 } }
        ]
        const countQuery = [
            ...conditionQuery,
            {
                $group: {
                    _id: '$_id',
                }
            },
            {
                $count: 'count'
            },
        ]
        const aggregateQuery = [
            ...conditionQuery,
            {
                $group: {
                    _id: '$_id',
                    userId: { $first: '$userId' },
                    totalPrice: { $first: '$totalPrice' },
                    createdAt: { $first: '$createdAt' },
                    boughtProducts: {
                        $push: {
                            quantity: '$boughtProducts.quantity',
                            productId: {
                                _id: '$boughtProducts.productId',
                                name: '$productDetails.name'
                            }
                        }
                    },
                }
            },
            {
                $project: {
                    userId: 1,
                    totalPrice: 1,
                    createdAt: 1,
                    boughtProducts: 1,
                }
            },
        ]

        const transactionsCount = (await TransActionInPerson.aggregate(countQuery))[0].count || 0

        const skip = (page - 1) * perPage;
        const tx = await TransActionInPerson.aggregate(aggregateQuery).skip(skip).limit(perPage)
        return {
            transactions: tx,
            transactionsCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            transactions: null,
            transactionsCount: 0,
            status: 500,
            message: error
        }
    }
}


// this api belongs to the sellers
const getAllMyTransActionInPersons = async (args, context) => {
    const { page, perPage } = args;
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo || !userInfo?.userId) {
            return {
                transactions: null,
                transactionsCount: 0,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        // Find all products with the specified sellerId
        const products = await Product.find({ sellerId: userInfo?.userId });

        // Extract the productIds from the products array
        const productIds = products.map(product => product._id);

        const condition = { 'boughtProducts.productId': { $in: productIds } }
        const skip = (page - 1) * perPage;

        const query = TransActionInPerson.find(condition).populate({ path: "userId", select: 'name phone' }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage)

        let count = 0
        const tx = await query.lean().exec();

        if (!skip && skip !== 0) count = tx.length
        else count = await TransActionInPerson.where(condition).countDocuments().exec();

        return {
            transactions: tx,
            transactionsCount: count,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            transactions: null,
            transactionsCount: 0,
            status: 500,
            message: error
        }
    }
}


module.exports = {
    getAllTransActionInPersons,
    getAllTransActionInPersonsOfASeller,
    getAllMyTransActionInPersons
}