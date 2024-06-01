const { TransAction, Product } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const getAllTransActions = async (args, context) => {
    const { userInfo } = context;
    const { page, perPage, isFutureOrder } = args;

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

        //if isFutureOrder is not specified
        if ((isFutureOrder == undefined || isFutureOrder == null) && isFutureOrder != 'false') {
            const count = await TransAction.where().countDocuments().exec();
            if (!page || !perPage) {
                const tx = await TransAction.find();
                return {
                    transactions: tx,
                    transactionsCount: count,
                    status: 200,
                    message: null
                }
            }

            const skip = (page - 1) * perPage;
            const tx = await TransAction.find().skip(skip).limit(perPage);
            return {
                transactions: tx,
                transactionsCount: count,
                status: 200,
                message: null
            }
        }

        const currentDate = (new Date()).getTime();

        //future Orders
        if (!!isFutureOrder && isFutureOrder == 'true') {
            const count = await TransAction.where({ shouldBeSentAt: { $gte: currentDate } }).countDocuments().exec();
            if (!page || !perPage) {
                const tx = await TransAction.find({ shouldBeSentAt: { $gte: currentDate } });
                return {
                    transactions: tx,
                    transactionsCount: count,
                    status: 200,
                    message: null
                }
            }
            const skip = (page - 1) * perPage;
            const tx = await TransAction.find({ shouldBeSentAt: { $gte: currentDate } }).skip(skip).limit(perPage);
            return {
                transactions: tx,
                transactionsCount: count,
                status: 200,
                message: null
            }
        }

        //past Orders
        const count = await TransAction.where({ shouldBeSentAt: { $lt: currentDate } }).countDocuments().exec();
        if (!page || !perPage) {
            const tx = await TransAction.find({ shouldBeSentAt: { $lt: currentDate } });
            return {
                transactions: tx,
                transactionsCount: count,
                status: 200,
                message: null
            }
        }
        const skip = (page - 1) * perPage;
        const tx = await TransAction.find({ shouldBeSentAt: { $lt: currentDate } }).skip(skip).limit(perPage);
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

const getAllMyTransActions = async (args, context) => {
    const { page, perPage, isFutureOrder } = args;
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


        //if isFutureOrder is not specified
        if ((isFutureOrder == undefined || isFutureOrder == null) && isFutureOrder != 'false') {
            const count = await TransAction.where({ 'boughtProducts.productId': { $in: productIds } }).countDocuments().exec();
            if (!page || !perPage) {
                const tx = await TransAction.find({ 'boughtProducts.productId': { $in: productIds } }).populate({ path: "userId", select: 'name phone' });
                return {
                    transactions: tx,
                    transactionsCount: count,
                    status: 200,
                    message: null
                }
            }

            const skip = (page - 1) * perPage;
            const tx = await TransAction.find({ 'boughtProducts.productId': { $in: productIds } }).populate({ path: "userId", select: 'name phone' }).skip(skip).limit(perPage);
            return {
                transactions: tx,
                transactionsCount: count,
                status: 200,
                message: null
            }
        }

        const currentDate = (new Date()).getTime();

        //future Orders
        if (!!isFutureOrder && isFutureOrder == 'true') {
            const count = await TransAction.where({ shouldBeSentAt: { $gte: currentDate }, 'boughtProducts.productId': { $in: productIds } }).countDocuments().exec();
            if (!page || !perPage) {
                const tx = await TransAction.find({ shouldBeSentAt: { $gte: currentDate }, 'boughtProducts.productId': { $in: productIds } }).populate({ path: "userId", select: 'name phone' });
                return {
                    transactions: tx,
                    transactionsCount: count,
                    status: 200,
                    message: null
                }
            }
            const skip = (page - 1) * perPage;
            const tx = await TransAction.find({ shouldBeSentAt: { $gte: currentDate }, 'boughtProducts.productId': { $in: productIds } }).populate({ path: "userId", select: 'name phone' }).skip(skip).limit(perPage);
            return {
                transactions: tx,
                transactionsCount: count,
                status: 200,
                message: null
            }
        }

        //past Orders
        const count = await TransAction.where({ shouldBeSentAt: { $lt: currentDate }, 'boughtProducts.productId': { $in: productIds } }).countDocuments().exec();
        if (!page || !perPage) {
            const tx = await TransAction.find({ shouldBeSentAt: { $lt: currentDate }, 'boughtProducts.productId': { $in: productIds } }).populate({ path: "userId", select: 'name phone' });
            return {
                transactions: tx,
                transactionsCount: count,
                status: 200,
                message: null
            }
        }
        const skip = (page - 1) * perPage;
        const tx = await TransAction.find({ shouldBeSentAt: { $lt: currentDate }, 'boughtProducts.productId': { $in: productIds } }).populate({ path: "userId", select: 'name phone' }).skip(skip).limit(perPage);
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

    try {
        //check if req contains token
        if (!userInfo) {
            return {
                transaction: null,
                status: 400,
                message: "You Are Not Authorized"
            }
        }

        const tx = await TransAction.findById(id)

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
    getAllMyTransActions,
    getOneTransAction
}