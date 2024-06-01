const { Product } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const ProductUpdate = async (args, context) => {
    const {
        id,
        name,
        desc,
        price,
        category,
        subcategory,
        imagesUrl
    } = args;

    const { userInfo } = context;


    try {
        if (!userInfo) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }

        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return {
                message: "Product doesn't exist",
                status: 400
            }
        }

        if (!(await isAdmin(userInfo?.userId)) && existingProduct?.sellerId != userInfo?.userId) {
            return {
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

        if (!!category) {
            existingProduct.category = category
        }

        if (!!subcategory) {
            existingProduct.subcategory = subcategory
        }

        if (imagesUrl !== undefined && imagesUrl !== null && imagesUrl?.length !== 0) {
            existingProduct.imagesUrl = imagesUrl
        }

        await existingProduct.save();

        return {
            message: "Product updated successfully",
            status: 200
        }

    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }

}

module.exports = {
    ProductUpdate
}