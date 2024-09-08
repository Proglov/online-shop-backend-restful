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

//this belong to getAllProductsOfACategory only
const getProductsWithTrueImagesUrl3 = async (input) => {
    if (Array.isArray(input)) {
        const output = []

        for (const subcategoryProducts of input) {
            const newProducts = [];
            for (const product of subcategoryProducts?.products) {
                if (product.imagesUrl.length !== 0) {
                    const filenames = product.imagesUrl
                    const args = { filenames };
                    const { urls } = await getImages(args, null);

                    const updatedProduct = {
                        ...product,
                        imagesUrl: urls,
                        imagesName: filenames
                    };

                    newProducts.push(updatedProduct);
                } else {
                    newProducts.push(product);
                }

            }
            output.push({
                _id: subcategoryProducts._id,
                products: newProducts
            })

        }

        return output;
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

const getAllProductsOfASeller = async (args, context) => {

    let { page, perPage, id } = args;
    let { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }
        const allProductsCount = await Product.where({
            sellerId: id
        }).countDocuments().exec();

        if (!page || !perPage) {
            const products = await Product.find({
                sellerId: id
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
            sellerId: id
        }).populate({
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

const getOneProduct = async (args, _context) => {
    const { id } = args;
    if (!id) {
        return {
            product: null,
            message: "Product ID is required",
            status: 400,
        };
    }

    try {
        const productData = await Product.aggregate([
            {
                "$match": {
                    "_id": new mongoose.Types.ObjectId(id)
                }
            },
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
                    "subcategoryId": "$subcategory._id",
                    "categoryId": { $arrayElemAt: ["$category._id", 0] },
                    "categoryName": { $arrayElemAt: ["$category.name", 0] },
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
                    },
                    // Add fields from festivalData (if exists)
                    "festivalOffPercentage": { $arrayElemAt: ["$festivalData.offPercentage", 0] },
                    "until": { $arrayElemAt: ["$festivalData.until", 0] },
                    // Add fields from majorShoppingData (if exists)
                    "quantity": { $arrayElemAt: ["$majorShoppingData.quantity", 0] },
                    "majorOffPercentage": { $arrayElemAt: ["$majorShoppingData.offPercentage", 0] }
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
                    "which": 1,
                    "categoryId": 1,
                    "categoryName": 1,
                    "festivalOffPercentage": 1,
                    "until": 1,
                    "quantity": 1,
                    "majorOffPercentage": 1
                }
            }
        ]).exec();

        if (productData.length === 0) {
            return {
                product: null,
                message: "Product not found",
                status: 404,
            };
        }

        const product = await getProductsWithTrueImagesUrl2(productData[0]);

        return {
            product,
            status: 200,
            message: null
        };

    } catch (error) {
        console.log(error);
        return {
            product: null,
            status: 500,
            message: error.message
        };
    }
};

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
            newIds.push(new mongoose.Types.ObjectId(args[key]))
        }
        const products = await Product.aggregate([
            {
                "$match": {
                    "_id": { $in: newIds }
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
                    },
                    "festivalOffPercentage": { $arrayElemAt: ["$festivalData.offPercentage", 0] },
                    "until": { $arrayElemAt: ["$festivalData.until", 0] },
                    "quantity": { $arrayElemAt: ["$majorShoppingData.quantity", 0] },
                    "majorOffPercentage": { $arrayElemAt: ["$majorShoppingData.offPercentage", 0] }
                }
            },
            {
                "$project": {
                    "name": 1,
                    "sellerId": 1,
                    "price": 1,
                    "imagesUrl": 1,
                    "which": 1,
                    "festivalOffPercentage": 1,
                    "until": 1,
                    "quantity": 1,
                    "majorOffPercentage": 1
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

const getAllProductsOfACategory = async (args, _context) => {

    let { categoryId } = args;
    let page = parseInt(args?.page)
    let perPage = parseInt(args?.perPage)

    if (!categoryId) return {
        products: null,
        message: "categoryId is required",
        status: 400
    }

    try {
        const aggregateQuery = [
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
                    },
                    "festivalOffPercentage": { $arrayElemAt: ["$festivalData.offPercentage", 0] },
                    "until": { $arrayElemAt: ["$festivalData.until", 0] },
                    "quantity": { $arrayElemAt: ["$majorShoppingData.quantity", 0] },
                    "majorOffPercentage": { $arrayElemAt: ["$majorShoppingData.offPercentage", 0] }
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
                    "which": 1,
                    "festivalOffPercentage": 1,
                    "until": 1,
                    "quantity": 1,
                    "majorOffPercentage": 1
                }
            },
            {
                $group: {
                    _id: '$subcategoryId',
                    products: { $push: "$$ROOT" }
                }
            }
        ]


        if (!page || !perPage) {
            const products = await Product.aggregate(aggregateQuery).exec();
            const newProds = await getProductsWithTrueImagesUrl3(products);

            return {
                products: newProds,
                status: 200,
                message: null
            }

        }


        page = page || 1;
        perPage = perPage || 10;
        const skip = (page - 1) * perPage;
        const paginationQuery =
        {
            $project: {
                _id: 1,
                products: { $slice: ["$products", skip, perPage] }
            }
        }
        const products = await Product.aggregate([...aggregateQuery, paginationQuery]).exec();
        const newProds = await getProductsWithTrueImagesUrl3(products);

        return {
            products: newProds,
            status: 200,
            message: null
        }

    } catch (error) {
        console.log(error);
        return {
            products: null,
            status: 500,
            message: error
        }
    }

}

const getAllProductsOfASubcategory = async (args, _context) => {

    let { subcategoryId, page, perPage } = args;

    page = parseInt(page)
    perPage = parseInt(perPage)

    if (!subcategoryId) return {
        products: null,
        message: "subcategoryId is required",
        status: 400
    }

    try {
        const aggregateQuery = [
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
            }
        ]
        const resultQuery = [
            ...aggregateQuery,
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
                    },
                    "festivalOffPercentage": { $arrayElemAt: ["$festivalData.offPercentage", 0] },
                    "until": { $arrayElemAt: ["$festivalData.until", 0] },
                    // Add fields from majorShoppingData (if exists)
                    "quantity": { $arrayElemAt: ["$majorShoppingData.quantity", 0] },
                    "majorOffPercentage": { $arrayElemAt: ["$majorShoppingData.offPercentage", 0] }
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
                    "which": 1,
                    "festivalOffPercentage": 1,
                    "until": 1,
                    "quantity": 1,
                    "majorOffPercentage": 1
                }
            }
        ]


        if (!page || !perPage) {
            const products = await Product.aggregate(resultQuery).exec();
            const newProds = await getProductsWithTrueImagesUrl2(products);
            return {
                products: newProds,
                status: 200,
                message: null
            }
        }


        page = page || 1;
        perPage = perPage || 10;
        const skip = (page - 1) * perPage;
        const products = await Product.aggregate(resultQuery).skip(skip).limit(perPage);
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
    getAllProductsOfASeller,
    getOneProduct,
    getOneProductParams,
    getSomeProducts,
    getAllProductsOfACategory,
    getAllProductsOfASubcategory
}