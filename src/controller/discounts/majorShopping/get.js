const mongoose = require('mongoose');
const { MajorShopping } = require('../../../models/dbModels');
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
            delete product.imagesUrl

            const updatedProduct = {
                ...product,
                imageUrl: ''
            };

            newProds.push(updatedProduct);
        }

    }

    return newProds;
};


const GetAllMajorShoppingProducts = async (args, _context) => {
    let { page, perPage, cityIds } = args;

    try {
        if (cityIds)
            cityIds = cityIds.split(',') || []

        const now = Date.now();

        // Common query stages for aggregating products
        const commonQuery = [
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
            }
        ];

        // Count query variables
        let countQuery;

        // If cityIds are provided, add warehouse lookup and filter
        if (cityIds && cityIds.length > 0) {
            commonQuery.push(
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'productDetails.warehouseId',
                        foreignField: '_id',
                        as: 'warehouseDetails'
                    }
                },
                {
                    $unwind: '$warehouseDetails'
                },
                {
                    $match: {
                        'warehouseDetails.citiesCovered': { $in: cityIds.map(id => new mongoose.Types.ObjectId(id)) }
                    }
                }
            );

            // Count query for when cityIds are provided
            countQuery = [
                ...commonQuery,
                {
                    $count: 'count'
                }
            ];
        } else {
            // Directly count if no cityIds are provided
            countQuery = [
                {
                    $match: { until: { $gt: now } },
                },
                {
                    $count: 'count'
                }
            ];
        }

        // Fetching product count
        const countResult = await MajorShopping.aggregate(countQuery);
        const allProductsCount = countResult.length > 0 ? countResult[0].count : 0;

        // Aggregate products query
        const aggregateQuery = [
            ...commonQuery,
            {
                $project: {
                    _id: 1,
                    productId: '$productDetails._id',
                    name: '$productDetails.name',
                    price: '$productDetails.price',
                    imagesUrl: '$productDetails.imagesUrl',
                    sellerId: '$productDetails.sellerId',
                    offPercentage: 1,
                    quantity: 1
                }
            }
        ];

        const skip = (page - 1) * perPage;
        const products = await MajorShopping.aggregate(aggregateQuery).skip(skip).limit(perPage);
        const newProds = await getProductsWithTrueImageUrl(products);

        return {
            products: newProds,
            allProductsCount,
            status: 200,
            message: null
        };

    } catch (error) {
        return {
            products: null,
            allProductsCount: 0,
            status: 500,
            message: error
        };
    }
}

const GetMyAllMajorShoppingProducts = async (args, context) => {
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
        const resultQuery = [...aggregateQuery, { $project: { productId: '$productDetails._id', offPercentage: 1, quantity: 1, name: '$productDetails.name' } }]

        const allProductsCount = (await MajorShopping.aggregate(countQuery))[0]?.count;

        const skip = (page - 1) * perPage;
        const products = await MajorShopping.aggregate([...resultQuery, { $skip: skip }, { $limit: perPage }]);

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
    GetAllMajorShoppingProducts,
    GetMyAllMajorShoppingProducts
}