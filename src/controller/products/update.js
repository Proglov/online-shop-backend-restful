const { Product, Subcategory, ProductHistory } = require('../../models/dbModels');
const { isAdmin } = require('../../lib/Functions');
const { getImages } = require('../image/get');
const { validator } = require('../../schemas/main');
const { updateProductSchema } = require('../../schemas/product');

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
                product: null,
                message: "You are not authorized!",
                status: 400
            }
        }

        const check = validator(args, updateProductSchema)

        if (check !== true) return {
            product: null,
            message: check[0].message,
            status: 400
        }

        const existingProduct = await Product.findById(id).populate({
            path: "subcategoryId",
            select: 'categoryId name',
            populate: {
                path: 'categoryId name'
            },
        });

        if (!existingProduct) {
            return {
                product: null,
                message: "Product doesn't exist",
                status: 400
            }
        }

        if (!(await isAdmin(userInfo?.userId)) && existingProduct?.sellerId != userInfo?.userId) {
            return {
                product: null,
                message: "You are not authorized!",
                status: 403
            }
        }

        if (!!name) {
            existingProduct.name = name
        }

        if (!!desc) {
            existingProduct.desc = desc
        }

        if (!!price) {
            existingProduct.price = price
        }

        if (!!subcategoryId) {
            const subcategory = await Subcategory.findById(subcategoryId);
            if (!!subcategory)
                existingProduct.subcategoryId = subcategoryId
        }

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
                    name: existingProduct.subcategoryId.name,
                    categoryId: {
                        name: existingProduct.subcategoryId.categoryId.name,
                    }
                }
            },
            message: "Product updated successfully",
            status: 202
        }

    } catch (error) {
        return {
            product: null,
            message: error,
            status: 500
        }
    }

}

module.exports = {
    ProductUpdate,
}