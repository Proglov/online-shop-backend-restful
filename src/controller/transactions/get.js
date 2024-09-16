const mongoose = require('mongoose');
const { TransAction, Product } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const getAllTransActions = async (args, context) => {
    const { userInfo } = context;
    const { page, perPage, isFutureOrder } = args;

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

        const condition = {}
        const skip = (page - 1) * perPage;

        if (!!isFutureOrder && isFutureOrder === "true") condition.shouldBeSentAt = { $gte: (new Date()).getTime() }
        else if (!!isFutureOrder && isFutureOrder === "false") condition.shouldBeSentAt = { $lt: (new Date()).getTime() }

        const query = TransAction.find(condition).populate({ path: "userId", select: 'name phone' }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage)

        let count = 0
        const tx = await query.lean().exec();

        if (!skip) count = tx.length
        else count = await TransAction.where(condition).countDocuments().exec();

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

const getAllTransActionsOfASeller = async (args, context) => {
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
                    totalDiscount: { $first: '$totalDiscount' },
                    totalPrice: { $first: '$totalPrice' },
                    discount: { $first: '$discount' },
                    shippingCost: { $first: '$shippingCost' },
                    address: { $first: '$address' },
                    shouldBeSentAt: { $first: '$shouldBeSentAt' },
                    createdAt: { $first: '$createdAt' },
                    status: { $first: '$status' },
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
                    totalDiscount: 1,
                    totalPrice: 1,
                    discount: 1,
                    shippingCost: 1,
                    address: 1,
                    shouldBeSentAt: 1,
                    createdAt: 1,
                    status: 1,
                    boughtProducts: 1,
                }
            },
        ]

        const transactionsCount = (await TransAction.aggregate(countQuery))[0].count || 0

        const skip = (page - 1) * perPage;
        const tx = await TransAction.aggregate(aggregateQuery).skip(skip).limit(perPage)
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
const getAllMyTransActions = async (args, context) => {
    const { page, perPage, isFutureOrder } = args;
    const { userInfo } = context;

    try {
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

        if (!!isFutureOrder && isFutureOrder === "true") condition.shouldBeSentAt = { $gte: (new Date()).getTime() }
        else if (!!isFutureOrder && isFutureOrder === "false") condition.shouldBeSentAt = { $lt: (new Date()).getTime() }

        const query = TransAction.find(condition).populate({ path: "userId", select: 'name phone' }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage)

        let count = 0
        const tx = await query.lean().exec();

        if (!skip) count = tx.length
        else count = await TransAction.where(condition).countDocuments().exec();

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

// this api belongs to the Users
const getAllMyTransActionsUser = async (args, context) => {
    const { userInfo } = context;
    const { page, perPage } = args;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                transactions: null,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        if (!page || !perPage) {
            const tx = await TransAction.find({ userId: userInfo?.userId }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 })
            return {
                transactions: tx,
                status: 200,
                message: null
            }
        }

        const condition = { userId: userInfo?.userId }
        const skip = (page - 1) * perPage;

        const query = TransAction.find(condition).populate({ path: "userId", select: 'name phone' }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage)

        const tx = await query.lean().exec();

        return {
            transactions: tx,
            status: 200,
            message: null
        }


    } catch (error) {
        return {
            transactions: null,
            status: 500,
            message: error
        }
    }
}

const getAllTransActionsOfAUser = async (args, context) => {
    const { userInfo } = context;
    const { page, perPage, id } = args;
    if (!id) {
        return {
            product: null,
            message: "user ID is required",
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


        if (!(await isAdmin(userInfo.userId))) {
            return {
                transactions: null,
                transactionsCount: 0,
                status: 403,
                message: "You Are Not Authorized"
            }
        }

        const condition = { userId: id }
        const skip = (page - 1) * perPage;

        const query = TransAction.find(condition).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage)

        let count = 0
        const tx = await query.lean().exec();

        if (!skip) count = tx.length
        else count = await TransAction.where(condition).countDocuments().exec();

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

const getAllTransActionsOfAProduct = async (args, context) => {
    const { userInfo } = context;
    const { page, perPage, id } = args;
    if (!id) {
        return {
            transactions: null,
            transactionsCount: 0,
            status: 403,
            message: "ID is required"
        }
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

        if (!(await isAdmin(userInfo.userId))) {
            const theProduct = await Product.findById(id);
            if (!theProduct?.sellerId.equals(new mongoose.Types.ObjectId(userInfo?.userId)))
                return {
                    transactions: null,
                    transactionsCount: 0,
                    status: 403,
                    message: "You Are Not Authorized"
                }
        }

        const condition = {
            boughtProducts: {
                $elemMatch: { productId: new mongoose.Types.ObjectId(id) }
            }
        }

        const skip = (page - 1) * perPage;

        const query = TransAction.find(condition).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage)

        let count = 0
        const tx = await query.lean().exec();

        if (!skip) count = tx.length
        else count = await TransAction.where(condition).countDocuments().exec();

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

const getOneTransAction = async (args, context) => {
    const { id } = args
    const { userInfo } = context;
    if (!id) {
        return {
            product: null,
            message: "transaction ID is required",
            status: 400,
        };
    }

    try {
        if (!userInfo) {
            return {
                transaction: null,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        const tx = await TransAction.findById(id).populate({
            path: "boughtProducts", populate: {
                path: 'productId',
                select: 'name'
            }
        }).lean().exec()

        //only admin and himself can get the tx
        if (!(await isAdmin(userInfo?.userId)) && userInfo?.userId !== tx.userId) {
            return {
                transaction: null,
                status: 403,
                message: "You Are Not Authorized"
            }
        }

        return {
            transaction: tx,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            transaction: null,
            status: 500,
            message: error
        }
    }
}

module.exports = {
    getAllTransActions,
    getAllTransActionsOfASeller,
    getAllMyTransActions,
    getAllMyTransActionsUser,
    getAllTransActionsOfAUser,
    getAllTransActionsOfAProduct,
    getOneTransAction
}