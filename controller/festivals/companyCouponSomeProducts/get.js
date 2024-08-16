const mongoose = require('mongoose');
const { CompanyCouponForSomeProducts } = require('../../../models/dbModels');


const GetAllMyCompanyCouponForSomeProducts = async (args, context) => {
    let { page, perPage } = args;
    const { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }
        const aggregateQuery = [
            {
                $lookup: {
                    from: 'products',
                    localField: 'productsIds',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: {
                    path: '$productDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    'productDetails.sellerId': new mongoose.Types.ObjectId(userInfo?.userId)
                }
            },
        ]
        const countQuery = [...aggregateQuery, { $count: 'count' }]
        const resultQuery = [...aggregateQuery, {
            $group: {
                _id: '$_id',
                body: { $first: '$body' },
                productsIds: { $first: '$productsIds' },
                minBuy: { $first: '$minBuy' },
                maxOffPrice: { $first: '$maxOffPrice' },
                offPercentage: { $first: '$offPercentage' },
                remainingCount: { $first: '$remainingCount' }
            }
        }]

        const allProductsCount = (await CompanyCouponForSomeProducts.aggregate(countQuery))[0]?.count;

        if (!page || !perPage) {
            const products = await CompanyCouponForSomeProducts.aggregate(resultQuery)
            return {
                products,
                allProductsCount,
                status: 200,
                message: null
            }
        }

        page = parseInt(page) || 1;
        perPage = parseInt(perPage) || 10;
        const skip = (page - 1) * perPage;
        const products = await CompanyCouponForSomeProducts.aggregate([...resultQuery, { $skip: skip }, { $limit: perPage }]);

        return {
            products,
            allProductsCount,
            status: 200,
            message: null
        }


    } catch (error) {
        console.log(error);
        return {
            products: null,
            allProductsCount: 0,
            status: 500,
            message: error
        }
    }

}

module.exports = {
    GetAllMyCompanyCouponForSomeProducts
}