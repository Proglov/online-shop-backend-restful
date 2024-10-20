const { Product, Seller, Subcategory, ProductHistory } = require('../../models/dbModels');
const { isAdmin } = require('../../lib/Functions');
const { getImages } = require('../image/get');
const { validator } = require('../../schemas/main');
const { postProductSchema } = require('../../schemas/product');
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

const ProductCreate = async (args, context) => {
    const {
        name,
        desc,
        price,
        subcategoryId,
        imagesUrl,
        count
    } = args;

    const { userInfo } = context;


    try {

        if (!userInfo || !userInfo?.userId) {
            return {
                ...error401,
                product: null
            }
        }

        const check = validator(args, postProductSchema)

        if (check !== true) return {
            product: null,
            message: check[0].message,
            status: 400
        }

        const seller = await Seller.findById(userInfo?.userId)

        if (!(await isAdmin(userInfo?.userId)) && !seller) {
            return {
                ...error401,
                product: null
            }
        }

        const subcategory = await Subcategory.findById(subcategoryId).populate({ path: "categoryId", select: 'name' });

        if (!subcategory)
            return {
                ...error401,
                product: null
            }

        const newProduct = new Product({
            name,
            desc,
            price,
            subcategoryId,
            sellerId: userInfo?.userId,
            imagesUrl,
            count
        })

        await newProduct.save();

        const newProd = await getProductsWithTrueImagesUrl(newProduct);

        const newProdHistory = new ProductHistory({
            productId: newProd._id,
            count
        })

        await newProdHistory.save();

        return {
            product: {
                _id: newProd._id,
                name,
                desc,
                price,
                count,
                imagesUrl: newProd.imagesUrl,
                subcategoryId: {
                    name: subcategory.name,
                    categoryId: {
                        name: subcategory.categoryId.name,
                    }
                }
            },
            message: 'The product has been created successfully',
            status: 201
        }

    } catch (error) {
        return {
            ...error500,
            product: null
        }
    }
}



module.exports = {
    ProductCreate
}