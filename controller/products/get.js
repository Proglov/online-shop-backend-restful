const { Product } = require('../../models/dbModels');
const { getImages } = require('../image/get');

const getProductsWithTrueImagesUrl = async (input) => {
    if (Array.isArray(input)) {
        const newProds = [];

        for (const product of input) {
            if (product.imagesUrl.length !== 0) {
                const filenames = product.imagesUrl
                const args = { filenames };
                const { urls } = await getImages(args, null);

                const updatedProduct = {
                    ...product?._doc,
                    imagesUrl: urls,
                    imagesName: filenames
                };

                newProds.push(updatedProduct);
            } else {
                newProds.push(product);
            }

        }

        return newProds;
    } else if (typeof input === 'object') {
        if (input.imagesUrl.length !== 0) {
            const filenames = input.imagesUrl
            const args = { filenames };
            const { urls } = await getImages(args, null);

            return {
                ...input?._doc,
                imagesUrl: urls,
                imagesName: filenames
            };
        }
        return input
    }

    return null; // Invalid input
};


const getAllProducts = async (args, _context) => {

    let { page, perPage } = args;

    try {
        const allProductsCount = await Product.where().countDocuments().exec();

        if (!page || !perPage) {
            const products = await Product.find({}).populate({
                path: "subcategoryId", select: 'categoryId name', populate: {
                    path: 'categoryId',
                    select: 'name'
                },
            });

            const newProds = await getProductsWithTrueImagesUrl(products);

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
        const products = await Product.find({}).populate({
            path: "subcategoryId", select: 'categoryId name', populate: {
                path: 'categoryId',
                select: 'name'
            },
        }).skip(skip).limit(perPage);
        const newProds = await getProductsWithTrueImagesUrl(products);
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

const getAllMyProducts = async (args, context) => {

    let { page, perPage } = args;
    let { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }
        const allProductsCount = await Product.where({
            sellerId: userInfo?.userId
        }).countDocuments().exec();

        if (!page || !perPage) {
            const products = await Product.find({
                sellerId: userInfo?.userId
            }).populate({
                path: "subcategoryId", select: 'categoryId name', populate: {
                    path: 'categoryId',
                    select: 'name'
                },
            });
            const newProds = await getProductsWithTrueImagesUrl(products);
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
        const products = await Product.find({
            sellerId: userInfo?.userId
        }).populate({
            path: "subcategoryId", select: 'categoryId name', populate: {
                path: 'categoryId',
                select: 'name'
            },
        }).skip(skip).limit(perPage);
        const newProds = await getProductsWithTrueImagesUrl(products);
        // console.log(newProds);
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

const getOneProduct = async (args, _context) => {
    const { id } = args
    try {
        const product = await Product.findById(id).populate({
            path: "subcategoryId", select: 'categoryId name', populate: {
                path: 'categoryId',
                select: 'name'
            },
        });
        const newProd = await getProductsWithTrueImagesUrl(product);
        return {
            product: newProd,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            product: null,
            status: 500,
            message: error
        }
    }

}

const getAllProductsOfACategory = async (args, _context) => {

    let { categoryId } = args;

    if (!categoryId) return {
        products: null,
        message: "categoryId is required",
        status: 400
    }

    try {
        const allProductsCount = await Product.where().countDocuments().exec();
        const products = await Product.find().populate({
            path: "subcategoryId", select: 'categoryId name', populate: {
                path: 'categoryId',
                select: 'name',
                match: {
                    categoryId
                }
            },
        });
        console.log(products);
        const newProds = await getProductsWithTrueImagesUrl(products);

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

module.exports = {
    getAllProducts,
    getAllMyProducts,
    getOneProduct,
    getAllProductsOfACategory
}