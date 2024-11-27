require('dotenv').config();
const mongoose = require('mongoose');
const { Product, Subcategory, Category } = require('../../models/dbModels');
const { getImages } = require('../image/get');
const { error500, error401 } = require('../../lib/errors');


const getProductsWithTrueImagesUrl = async (input) => {
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

const getProductsWithTrueImagesUrl2 = async (input) => {
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
    const { page, perPage } = args;
    try {
        const skip = (page - 1) * perPage;

        const query = Product.find({}).populate({
            path: "subcategoryId", select: 'categoryId name', populate: {
                path: 'categoryId',
                select: 'name'
            },
        }).populate({ path: "warehouseId", select: 'name' }).skip(skip).limit(perPage)

        let allProductsCount = 0
        const products = await query.lean().exec();
        const newProds = await getProductsWithTrueImagesUrl(products);

        if (!skip && skip !== 0) allProductsCount = products.length
        else allProductsCount = await Product.where().countDocuments().exec();

        return {
            products: newProds,
            allProductsCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            ...error500,
            products: null,
            allProductsCount: 0
        }
    }
}

const getAllMyProducts = async (args, context) => {
    let { page, perPage } = args;
    let { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                ...error401,
                products: null,
                allProductsCount: 0,
            }
        }

        const skip = (page - 1) * perPage;
        const condition = { sellerId: userInfo?.userId }
        const query = Product.find(condition).populate({
            path: "subcategoryId",
            select: 'categoryId name',
            populate: {
                path: 'categoryId',
                select: 'name'
            },
        }).populate({ path: "warehouseId", select: 'name' }).skip(skip).limit(perPage)

        let allProductsCount = 0
        const products = await query.lean().exec();
        const newProds = await getProductsWithTrueImagesUrl(products);

        if (!skip && skip !== 0) allProductsCount = products.length
        else allProductsCount = await Product.where(condition).countDocuments().exec();

        return {
            products: newProds,
            allProductsCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            ...error500,
            products: null,
            allProductsCount: 0
        }
    }
}

const getAllProductsOfASeller = async (args, context) => {
    let { page, perPage, id } = args;
    let { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                ...error401,
                products: null,
                allProductsCount: 0,
            }
        }

        const skip = (page - 1) * perPage;
        const condition = { sellerId: id }
        const query = Product.find(condition).populate({
            path: "subcategoryId", select: 'categoryId name', populate: {
                path: 'categoryId',
                select: 'name'
            },
        }).skip(skip).limit(perPage)

        let allProductsCount = 0
        const products = await query.lean().exec();
        const newProds = await getProductsWithTrueImagesUrl(products);

        if (!skip && skip !== 0) allProductsCount = products.length
        else allProductsCount = await Product.where(condition).countDocuments().exec();

        return {
            products: newProds,
            allProductsCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            ...error500,
            products: null,
            allProductsCount: 0
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

        const product = await getProductsWithTrueImagesUrl(productData[0]);

        return {
            product,
            status: 200,
            message: null
        };

    } catch (error) {
        return {
            ...error500,
            product: null
        };
    }
};

const getOneProductParams = async (args, _context) => {
    const { id } = args
    if (!id) {
        return {
            product: null,
            message: "Product ID is required",
            status: 400,
        };
    }

    try {
        const product = await Product.findById(id).populate({
            path: "subcategoryId",
            select: 'categoryId',
            populate: {
                path: 'categoryId'
            },
        }).select('_id subcategoryId').lean().exec();

        const params = product.subcategoryId.categoryId._id + '/' + product.subcategoryId._id + '/' + id
        return {
            params,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            ...error500,
            params: null
        }
    }

}

const getSomeProducts = async (args, _context) => {
    try {
        const newIds = []
        const keys = Object.keys(args)
        for (const key of keys) {
            newIds.push(new mongoose.Types.ObjectId(encodeURIComponent(args[key])))
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
        const newProds = await getProductsWithTrueImagesUrl(products);
        return {
            products: newProds,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            ...error500,
            products: null
        }
    }
}

const getPopularProducts = async (_args, _context) => {
    try {
        const ids = ['6740a359a728dfb50f2f4d4e', '6740a4a5a728dfb50f2f4d8a', '6740a51aa728dfb50f2f4d98', '6740a560a728dfb50f2f4dae', '6740a5d0a728dfb50f2f4dcd', '6740a5f5a728dfb50f2f4ddf', '6740a638a728dfb50f2f4df1', '6740a667a728dfb50f2f4e03']
        const devIds = ['6697a70df8be559bd3949cac']


        let newIds;

        if (process.env.ENVIRONMENT === 'dev') newIds = devIds.map(id => new mongoose.Types.ObjectId(id))
        else newIds = ids.map(id => new mongoose.Types.ObjectId(id))

        const products = await Product.find({ _id: { $in: newIds } }).select('_id name imagesUrl').exec()

        const newProds = await getProductsWithTrueImagesUrl2(products);
        return {
            products: newProds,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            ...error500,
            products: null
        }
    }
}

const getAllProductsOfACategory = async (args, _context) => {
    let { categoryId, page, perPage, cityIds } = args;

    if (!categoryId) return {
        products: null,
        message: "categoryId is required",
        status: 400
    };

    try {
        // Parse cityIds into an array if they are provided
        cityIds = !!cityIds ? JSON.parse(cityIds) : []

        let aggregateQuery = [
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
        ];

        // If cityIds are provided, add warehouse lookup and filter
        if (cityIds.length > 0) {
            const beforeFestivalIndex = 4;

            aggregateQuery = [
                ...aggregateQuery.slice(0, beforeFestivalIndex),
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehouseId',
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
                },
                ...aggregateQuery.slice(beforeFestivalIndex),
            ]
        }

        // Handle Pagination
        if (page && perPage) {
            const skip = (page - 1) * perPage;
            aggregateQuery.push(
                {
                    $project: {
                        _id: 1,
                        products: { $slice: ["$products", skip, perPage] }
                    }
                }
            );
        }

        const products = await Product.aggregate(aggregateQuery).exec();
        const newProds = await getProductsWithTrueImagesUrl3(products);

        return {
            products: newProds,
            status: 200,
            message: null
        };

    } catch (error) {
        return {
            products: null,
            message: error.message,
            status: 500
        };
    }
};

const getAllProductsOfASubcategory = async (args, _context) => {

    let { subcategoryId, page, perPage, cityIds } = args;
    if (!subcategoryId) return {
        products: null,
        message: "subcategoryId is required",
        status: 400
    }

    try {
        // Parse cityIds into an array if they are provided
        cityIds = !!cityIds ? JSON.parse(cityIds) : []

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
        let resultQuery = [
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


        // If cityIds are provided, add warehouse lookup and filter
        if (cityIds.length > 0) {
            const beforeFestivalIndex = 4;

            resultQuery = [
                ...resultQuery.slice(0, beforeFestivalIndex),
                {
                    $lookup: {
                        from: 'warehouses',
                        localField: 'warehouseId',
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
                },
                ...resultQuery.slice(beforeFestivalIndex),
            ]
        }

        if (!page || !perPage) {
            const products = await Product.aggregate(resultQuery).exec();
            const newProds = await getProductsWithTrueImagesUrl(products);
            return {
                products: newProds,
                status: 200,
                message: null
            }
        }


        const skip = (page - 1) * perPage;
        const products = await Product.aggregate(resultQuery).skip(skip).limit(perPage);
        const newProds = await getProductsWithTrueImagesUrl(products);
        return {
            products: newProds,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            ...error500,
            products: null
        }
    }
}

const searchForProducts = async (args, _context) => {
    const { str, page, perPage } = args;

    if (!str || typeof str !== 'string') return {
        products: null,
        message: "str is required",
        status: 400
    };

    try {
        // Step 1: Find related categories and subcategories
        const categories = await Category.find({ name: new RegExp(str, 'i') }).exec();
        const categoryIds = categories.map(category => new mongoose.Types.ObjectId(category._id));

        const subcategories = await Subcategory.find({
            $or: [
                { name: new RegExp(str, 'i') },
                { categoryId: { $in: categoryIds } }
            ]
        }).exec();
        const subcategoryIds = subcategories.map(subcategory => new mongoose.Types.ObjectId(subcategory._id));

        // Step 2: Construct the aggregate query
        const aggregateQuery = [
            {
                // Match products based on name, desc, or related subcategories
                $match: {
                    $or: [
                        { name: new RegExp(str, 'i') }, // Products containing str in name
                        { desc: new RegExp(str, 'i') }, // Products containing str in description
                        { subcategoryId: { $in: subcategoryIds } }, // Products matching found subcategories
                    ]
                }
            },
            {
                // Lookup for subcategory
                "$lookup": {
                    from: "subcategories",
                    localField: "subcategoryId",
                    foreignField: "_id",
                    as: "subcategory"
                }
            },
            {
                // Unwind the subcategory array
                "$unwind": {
                    path: "$subcategory",
                    preserveNullAndEmptyArrays: true // Keep products without subcategories
                }
            },
            {
                // Lookup for festival data
                "$lookup": {
                    from: "festivals",
                    localField: "_id",
                    foreignField: "productId",
                    as: "festivalData"
                }
            },
            {
                // Lookup for major shopping data
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
            }
        ];

        // Step 3: Handle pagination
        if (page && perPage) {
            const skip = (page - 1) * perPage;
            aggregateQuery.push({ $skip: skip }, { $limit: perPage });
        }

        // Step 4: Execute the aggregation query
        const products = await Product.aggregate(aggregateQuery).exec();
        const newProds = await getProductsWithTrueImagesUrl(products);

        return {
            products: newProds,
            status: 200,
            message: null
        };
    } catch (error) {
        return {
            ...error500,
            products: null
        };
    }
}


module.exports = {
    getAllProducts,
    getAllMyProducts,
    getAllProductsOfASeller,
    getOneProduct,
    getOneProductParams,
    getSomeProducts,
    getPopularProducts,
    getAllProductsOfACategory,
    getAllProductsOfASubcategory,
    searchForProducts
}