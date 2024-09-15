const mongoose = require('mongoose');
const { TransActionInPerson, Product } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const getAllTransActionInPersons = async (args, context) => {
    const { userInfo } = context;
    const { page, perPage } = args;

    try {
        //check if req contains token
        if (!userInfo) {
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


        const count = await TransActionInPerson.where().countDocuments().exec();
        if (!page || !perPage) {
            const tx = await TransActionInPerson.find().populate({ path: "userId", select: 'name phone' }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 });
            return {
                transactions: tx,
                transactionsCount: count,
                status: 200,
                message: null
            }
        }

        const skip = (page - 1) * perPage;
        const tx = await TransActionInPerson.find().populate({ path: "userId", select: 'name phone' }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage);
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
    const { id } = args;
    const { userInfo } = context;
    let page = parseInt(args.page), perPage = parseInt(args.perPage)

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


        if (!page || !perPage) {
            const tx = await TransActionInPerson.aggregate(aggregateQuery)
            return {
                transactions: tx,
                transactionsCount,
                status: 200,
                message: null
            }
        }

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

        const count = await TransActionInPerson.where({ 'boughtProducts.productId': { $in: productIds } }).countDocuments().exec();
        if (!page || !perPage) {
            const tx = await TransActionInPerson.find({ 'boughtProducts.productId': { $in: productIds } }).populate({ path: "userId", select: 'name phone' }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 });
            return {
                transactions: tx,
                transactionsCount: count,
                status: 200,
                message: null
            }
        }

        const skip = (page - 1) * perPage;
        const tx = await TransActionInPerson.find({ 'boughtProducts.productId': { $in: productIds } }).populate({ path: "userId", select: 'name phone' }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage);
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

//not edited
// this api belongs to the Users
const getAllMyTransActionInPersonsUser = async (args, context) => {
    const { userInfo } = context;
    let page = parseInt(args?.page)
    let perPage = parseInt(args?.perPage)

    try {
        //check if req contains token
        if (!userInfo || !userInfo?.userId) {
            return {
                transactions: null,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        if (!page || !perPage) {
            const tx = await TransActionInPerson.find({ userId: userInfo?.userId }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 })
            return {
                transactions: tx,
                status: 200,
                message: null
            }
        }

        page = page || 1;
        perPage = perPage || 10;
        const skip = (page - 1) * perPage;
        const tx = await TransActionInPerson.find({ userId: userInfo?.userId }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage);
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

//not edited
const getAllTransActionInPersonsOfAUser = async (args, context) => {
    const { userInfo } = context;
    const { id } = args;
    let page = parseInt(args?.page)
    let perPage = parseInt(args?.perPage)
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


        if (!(await isAdmin(userInfo.userId))) {
            return {
                transactions: null,
                transactionsCount: 0,
                status: 403,
                message: "You Are Not Authorized"
            }
        }

        if (!id) {
            return {
                transactions: null,
                transactionsCount: 0,
                status: 403,
                message: "ID is required"
            }
        }

        const count = await TransActionInPerson.where({ userId: id }).countDocuments().exec();

        if (!page || !perPage) {
            const tx = await TransActionInPerson.find({ userId: id }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 });
            return {
                transactions: tx,
                transactionsCount: count,
                status: 200,
                message: null
            }
        }

        page = page || 1;
        perPage = perPage || 10;
        const skip = (page - 1) * perPage;
        const tx = await TransActionInPerson.find({ userId: id }).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage);
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

//not edited
const getAllTransActionInPersonsOfAProduct = async (args, context) => {
    const { userInfo } = context;
    const { id } = args;
    let page = parseInt(args?.page)
    let perPage = parseInt(args?.perPage)
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

        if (!id) {
            return {
                transactions: null,
                transactionsCount: 0,
                status: 403,
                message: "ID is required"
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

        const queryObj = {
            boughtProducts: {
                $elemMatch: { productId: new mongoose.Types.ObjectId(id) }
            }
        }

        const count = await TransActionInPerson.where(queryObj).countDocuments().exec();

        if (!page || !perPage) {
            const tx = await TransActionInPerson.find(queryObj).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 });
            return {
                transactions: tx,
                transactionsCount: count,
                status: 200,
                message: null
            }
        }

        page = page || 1;
        perPage = perPage || 10;
        const skip = (page - 1) * perPage;
        const tx = await TransActionInPerson.find(queryObj).populate({ path: "boughtProducts.productId", select: 'name' }).sort({ createdAt: -1 }).skip(skip).limit(perPage);
        return {
            transactions: tx,
            transactionsCount: count,
            status: 200,
            message: null
        }


    } catch (error) {
        return {
            transactions: null,
            transactionsCount: 0
            ,
            status: 500,
            message: error
        }
    }
}

//not edited
const getOneTransActionInPerson = async (args, context) => {
    const { id } = args
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            return {
                transactions: null,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        const tx = await TransActionInPerson.findById(id).populate({
            path: "boughtProducts", populate: {
                path: 'productId',
                select: 'name'
            }
        })

        //only admin and himself can get the tx

        if (!(await isAdmin(userInfo?.userId)) && userInfo?.userId !== tx.userId) {
            return {
                transactions: null,
                status: 403,
                message: "You Are Not Authorized"
            }
        }

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

module.exports = {
    getAllTransActionInPersons,
    getAllTransActionInPersonsOfASeller,
    getAllMyTransActionInPersons,
    getAllMyTransActionInPersonsUser,
    getAllTransActionInPersonsOfAUser,
    getAllTransActionInPersonsOfAProduct,
    getOneTransActionInPerson
}