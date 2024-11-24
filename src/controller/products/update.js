const { Product, Subcategory, ProductHistory, Warehouse } = require('../../models/dbModels');
const { isAdmin } = require('../../lib/Functions');
const { getImages } = require('../image/get');
const { validator } = require('../../schemas/main');
const { updateProductSchema } = require('../../schemas/product');
const { error401, error500 } = require('../../lib/errors');

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

const ProductUpdate = async (args, context) => {
    const {
        id,
        name,
        desc,
        price,
        subcategoryId,
        warehouseId,
        imagesUrl,
        addedCount
    } = args;
    const { userInfo } = context;

    if (!id) return {
        product: null,
        message: 'id is required',
        status: 400
    }
    try {
        if (!userInfo) {
            return {
                ...error401,
                product: null
            }
        }

        const check = validator(args, updateProductSchema)

        if (check !== true) return {
            product: null,
            message: check[0].message,
            status: 400
        }

        const existingProduct = await Product.findById(id).populate({
            path: 'subcategoryId',
            select: 'name categoryId',
            populate: {
                path: 'categoryId',
                select: 'name'
            }
        }).exec();

        if (!existingProduct) {
            return {
                product: null,
                message: "Product doesn't exist",
                status: 400
            }
        }

        if (!(await isAdmin(userInfo?.userId)) && existingProduct?.sellerId != userInfo?.userId) {
            return {
                ...error401,
                product: null
            }
        }

        if (!!name && name !== existingProduct.name) {
            existingProduct.name = name
        }

        if (!!desc && desc !== existingProduct.desc) {
            existingProduct.desc = desc
        }

        if (!!price && price !== existingProduct.price) {
            existingProduct.price = price
        }

        let subcategory;
        if (!!subcategoryId && subcategoryId !== existingProduct.subcategoryId._id) {
            subcategory = await Subcategory.findById(subcategoryId).populate('categoryId', 'name');
        }
        //we need this for returning the data and setting new data
        if (!!subcategory)
            existingProduct.subcategoryId = subcategoryId
        else subcategory = existingProduct.subcategoryId


        let warehouse;
        if (!!warehouseId && warehouseId !== existingProduct.warehouseId) {
            warehouse = await Warehouse.findById(warehouseId);
        }
        //we need this for returning the data and setting new data
        if (!!warehouse && warehouse.sellerId === userInfo.userId)
            existingProduct.warehouseId = warehouseId
        else warehouse = existingProduct.warehouseId

        if (imagesUrl !== undefined && imagesUrl !== null && Array.isArray(imagesUrl)) {
            existingProduct.imagesUrl = imagesUrl
        }

        if (!!addedCount) {
            existingProduct.count = existingProduct.count + addedCount;
            const newProdHistory = new ProductHistory({
                productId: id,
                count: addedCount
            })
            await newProdHistory.save();
        }

        await existingProduct.save();

        const newProd = await getProductsWithTrueImagesUrl(existingProduct);

        return {
            product: {
                _id: id,
                name: existingProduct.name,
                desc: existingProduct.desc,
                price: existingProduct.price,
                count: existingProduct.count,
                imagesUrl: newProd.imagesUrl,
                subcategoryId: {
                    name: subcategory.name,
                    categoryId: {
                        name: subcategory.categoryId.name,
                    }
                },
                warehouseId: {
                    name: warehouse.name,
                }
            },
            message: "Product updated successfully",
            status: 202
        }

    } catch (error) {
        return {
            ...error500,
            product: null
        }
    }
}

module.exports = {
    ProductUpdate,
}