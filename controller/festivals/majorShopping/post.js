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
                majorShopping: null,
                message: "You are not authorized!",
                status: 400
            }
        }

        const product = await Product.findById(productId)

        if (!product) return {
            majorShopping: null,
            message: "No Product Found!",
            status: 404
        }

        const existingProduct = await MajorShopping.findOne({ productId })


        if (existingProduct) return {
            majorShopping: null,
            message: "this product already exists in the majorShopping!",
            status: 400
        }

        if (!(await isAdmin(userInfo?.userId)) && !product.sellerId.equals(new mongoose.Types.ObjectId(userInfo?.userId))) return {
            majorShopping: null,
            message: "You are not authorized!",
            status: 403
        }

        if (typeof offPercentage !== 'number' || typeof quantity !== 'number') return {
            majorShopping: null,
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
            majorShopping: {
                _id: newMajorShopping._id,
                productId,
                offPercentage,
                quantity
            },
            message: "MajorShopping Has Been Created Successfully!",
            status: 201
        }

    } catch (error) {
        return {
            majorShopping: null,
            message: error,
            status: 500
        }
    }
}



module.exports = {
    MajorShoppingCreate
}