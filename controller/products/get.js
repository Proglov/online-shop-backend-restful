const mongoose = require('mongoose');
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

//the difference between these 2 funcs is that the input of the func below, doesn't have ._doc 
const getProductsWithTrueImagesUrl2 = async (input) => {
    if (Array.isArray(input)) {
        const newProds = [];

        for (const product of input) {
            if (product.imagesUrl.length !== 0) {
                const filenames = product.imagesUrl
                const args = { filenames };
                const { urls } = await getImages(args, null);

                const updatedProduct = {
                    ...product,
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
                ...input,
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

const getOneProductParams = async (args, _context) => {
    const { id } = args
    try {
        const product = await Product.findById(id).populate({
            path: "subcategoryId", select: 'categoryId', populate: {
                path: 'categoryId'
            },
        }).select('_id subcategoryId');

        const params = product.subcategoryId.categoryId._id + '/' + product.subcategoryId._id + '/' + id
        return {
            params,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            params: null,
            status: 500,
            message: error
        }
    }

}

const getSomeProducts = async (args, _context) => {
    try {
        const newIds = []
        const keys = Object.keys(args)
        for (const key of keys) {
            newIds.push(args[key])
        }
        const products = await Product.find({
            '_id': { $in: newIds }
        })
        const newProds = await getProductsWithTrueImagesUrl(products);
        return {
            products: newProds,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            products: null,
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
        const products = await Product.aggregate([
            {
                "$lookup": {
                    from: "subcategories",
                    localField: "subcategoryId",
                    foreignField: '_id',
                    as: 'subcategory'
                }
            },
            {
                "$unwind": "$subcategory"
            },
            {
                "$lookup": {
                    from: "categories",
                    localField: "subcategory.categoryId",
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                "$match": {
                    "category._id": new mongoose.Types.ObjectId(categoryId) // Filtering based on categoryId
                }
            },
            {
                "$lookup": {
                    from: "festivals",
                    localField: "_id",
                    foreignField: "productId",
                    as: "festivalData"
                }
            },
            {
                "$lookup": {
                    from: "majorshoppings",
                    localField: "_id",
                    foreignField: "productId",
                    as: "majorShoppingData"
                }
            },
            {
                "$addFields": {
                    "subcategoryName": "$subcategory.name",
                    "which": {
                        $switch: {
                            branches: [
                                {
                                    case: { $gt: [{ $size: "$festivalData" }, 0] },
                                    then: "festival"
                                },
                                {
                                    case: { $gt: [{ $size: "$majorShoppingData" }, 0] },
                                    then: "major"
                                }
                            ],
                            default: ""
                        }
                    }
                }
            },
            {
                "$project": {
                    "subcategoryName": 1,
                    "subcategoryId": 1,
                    "name": 1,
                    "desc": 1,
                    "sellerId": 1,
                    "price": 1,
                    "imagesUrl": 1,
                    "which": 1
                }
            }
        ]).exec();

        const newProds = await getProductsWithTrueImagesUrl2(products);

        return {
            products: newProds,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            products: null,
            status: 500,
            message: error
        }
    }

}

const getAllProductsOfASubcategory = async (args, _context) => {

    let { subcategoryId } = args;

    if (!subcategoryId) return {
        products: null,
        message: "subcategoryId is required",
        status: 400
    }

    try {
        const products = await Product.aggregate([
            {
                "$lookup": {
                    from: "subcategories",
                    localField: "subcategoryId",
                    foreignField: '_id',
                    as: 'subcategory'
                }
            },
            {
                "$unwind": "$subcategory"
            },
            {
                "$match": {
                    "subcategory._id": new mongoose.Types.ObjectId(subcategoryId)
                }
            },
            {
                "$lookup": {
                    from: "festivals",
                    localField: "_id",
                    foreignField: "productId",
                    as: "festivalData"
                }
            },
            {
                "$lookup": {
                    from: "majorshoppings",
                    localField: "_id",
                    foreignField: "productId",
                    as: "majorShoppingData"
                }
            },
            {
                "$addFields": {
                    "subcategoryName": "$subcategory.name",
                    "which": {
                        $switch: {
                            branches: [
                                {
                                    case: { $gt: [{ $size: "$festivalData" }, 0] },
                                    then: "festival"
                                },
                                {
                                    case: { $gt: [{ $size: "$majorShoppingData" }, 0] },
                                    then: "major"
                                }
                            ],
                            default: ""
                        }
                    }
                }
            },
            {
                "$project": {
                    "subcategoryName": 1,
                    "subcategoryId": 1,
                    "name": 1,
                    "desc": 1,
                    "sellerId": 1,
                    "price": 1,
                    "imagesUrl": 1,
                    "which": 1
                }
            }
        ]).exec();

        const newProds = await getProductsWithTrueImagesUrl2(products);

        return {
            products: newProds,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            products: null,
            status: 500,
            message: error
        }
    }

}

module.exports = {
    getAllProducts,
    getAllMyProducts,
    getOneProduct,
    getOneProductParams,
    getSomeProducts,
    getAllProductsOfACategory,
    getAllProductsOfASubcategory
}