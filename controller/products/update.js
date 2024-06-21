const { Product, Subcategory } = require('../../models/dbModels');
const { isAdmin } = require('../../lib/Functions');
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

const ProductUpdate = async (args, context) => {
    const {
        id,
        name,
        desc,
        price,
        subcategoryId,
        imagesUrl
    } = args;

    const { userInfo } = context;


    try {
        if (!userInfo) {
            return {
                product: null,
                message: "You are not authorized!",
                status: 400
            }
        }

        const existingProduct = await Product.findById(id);

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

        let subcategory;

        if (!!subcategoryId) {
            existingProduct.subcategoryId = subcategoryId
            subcategory = await Subcategory.findById(subcategoryId).populate({ path: "categoryId", select: 'name' });
        }

        if (imagesUrl !== undefined && imagesUrl !== null) {
            existingProduct.imagesUrl = imagesUrl
        }

        await existingProduct.save();

        const newProd = await getProductsWithTrueImagesUrl(existingProduct);

        return {
            product: {
                _id: newProd._id,
                name,
                desc,
                price,
                imagesUrl: newProd.imagesUrl,
                subcategoryId: {
                    name: subcategory.name,
                    categoryId: {
                        name: subcategory.categoryId.name,
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
    ProductUpdate
}