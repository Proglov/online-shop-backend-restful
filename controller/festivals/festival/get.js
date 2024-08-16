const mongoose = require('mongoose');
const { Festival } = require('../../../models/dbModels');
const { getImage } = require('../../image/get');

const getProductsWithTrueImageUrl = async (input) => {
    const newProds = [];

    for (const product of input) {
        if (product.imagesUrl.length !== 0) {
            const filename = product.imagesUrl[0]
            const args = { filename };
            const { url } = await getImage(args, null);
            delete product.imagesUrl

            const updatedProduct = {
                ...product,
                imageUrl: url
            };

            newProds.push(updatedProduct);
        } else {
            newProds.push(product);
        }

    }

    return newProds;
};

const GetAllFestivalProducts = async (args, _context) => {
    let { page, perPage } = args;

    try {
        const now = Date.now()
        const conditionQuery = { until: { $gt: now } }
        const aggregateQuery = [
            {
                $match: conditionQuery
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $project: {
                    _id: 1,
                    productId: '$productDetails._id',
                    name: '$productDetails.name',
                    price: '$productDetails.price',
                    imagesUrl: '$productDetails.imagesUrl',
                    offPercentage: 1,
                    until: 1
                }
            }
        ]
        const allProductsCount = await Festival.where(conditionQuery).countDocuments().exec();

        if (!page || !perPage) {
            const products = await Festival.aggregate(aggregateQuery);
            const newProds = await getProductsWithTrueImageUrl(products);

            return {
                products: newProds,
                allProductsCount,
                status: 200,
                message: null
            }
        }

        page = parseInt(page);
        perPage = parseInt(perPage);
        const skip = (page - 1) * perPage;
        const products = await Festival.aggregate(aggregateQuery).skip(skip).limit(perPage);
        const newProds = await getProductsWithTrueImageUrl(products);

        return {
            products: newProds,
            allProductsCount,
            status: 200,
            message: null
        }


    } catch (error) {
        return {
            products: null,
            allProductsCount: 0,
            status: 500,
            message: error
        }
    }

}

const GetAllMyFestivalProducts = async (args, context) => {
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
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $match: {
                    'productDetails.sellerId': new mongoose.Types.ObjectId(userInfo?.userId)
                }
            }
        ]
        const countQuery = [...aggregateQuery, { $count: 'count' }]
        const resultQuery = [...aggregateQuery, { $project: { productId: 1, offPercentage: 1, until: 1, name: '$productDetails.name' } }]

        const allProductsCount = (await Festival.aggregate(countQuery))[0].count;

        if (!page || !perPage) {
            const products = await Festival.aggregate(resultQuery);
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
        const products = await Festival.aggregate([...resultQuery, { $skip: skip }, { $limit: perPage }]);

        return {
            products,
            allProductsCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            products: null,
            allProductsCount: 0,
            status: 500,
            message: error
        }
    }

}

module.exports = {
    GetAllFestivalProducts,
    GetAllMyFestivalProducts
}