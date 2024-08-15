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
            newProds.push(product);
        }

    }

    return newProds;
};



const GetAllMajorShoppingProducts = async (args, _context) => {
    let { page, perPage } = args;

    try {
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
                $project: {
                    _id: 1,
                    productId: '$productDetails._id',
                    name: '$productDetails.name',
                    price: '$productDetails.price',
                    imagesUrl: '$productDetails.imagesUrl',
                    offPercentage: 1,
                    quantity: 1
                }
            }
        ]
        const allProductsCount = await MajorShopping.where().countDocuments().exec();

        if (!page || !perPage) {
            const products = await MajorShopping.aggregate(aggregateQuery);
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
        const products = await MajorShopping.aggregate(aggregateQuery).skip(skip).limit(perPage);
        const newProds = await getProductsWithTrueImageUrl(products);

        return {
            products: newProds,
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
    GetAllMajorShoppingProducts
}