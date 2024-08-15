const mongoose = require('mongoose');
const { MajorShopping, Product } = require('../../../models/dbModels');

const { isAdmin } = require('../../../lib/Functions');


const MajorShoppingCreate = async (args, context) => {
    const {
        productId,
        offPercentage,
        quantity
    } = args;

    const { userInfo } = context;


    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }

        const product = await Product.findById(productId)

        if (!product) return {
            message: "No Product Found!",
            status: 404
        }

        const existingProduct = await MajorShopping.findOne({ productId })


        if (existingProduct) return {
            message: "this product already exists in the festival!",
            status: 400
        }

        if (!(await isAdmin(userInfo?.userId)) && !product.sellerId.equals(new mongoose.Types.ObjectId(userInfo?.userId))) return {
            message: "You are not authorized!",
            status: 403
        }

        if (typeof offPercentage !== 'number' || typeof quantity !== 'number') return {
            message: "offPercentage and quantity is required",
            status: 400
        }

        const newMajorShopping = new MajorShopping({
            productId,
            offPercentage,
            quantity
        })

        newMajorShopping.save();

        return {
            message: "MajorShopping Has Been Created Successfully!",
            status: 201
        }

    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }


}



module.exports = {
    MajorShoppingCreate
}