const { Product, Seller } = require('../../models/dbModels');


const { isAdmin } = require('../../lib/Functions');

const ProductCreate = async (args, context) => {
    const {
        name,
        desc,
        price,
        subcategoryId,
        imagesUrl,
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

        const seller = await Seller.findById(userInfo?.userId)

        if (!(await isAdmin(userInfo?.userId)) && !seller) {
            return {
                product: null,
                message: "You are not authorized!",
                status: 403
            }
        }

        const newProduct = new Product({
            name,
            desc,
            price,
            subcategoryId,
            sellerId: userInfo?.userId,
            imagesUrl
        })

        await newProduct.save();

        return {
            product: newProduct,
            message: 'The product has been created successfully',
            status: 201
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
    ProductCreate
}