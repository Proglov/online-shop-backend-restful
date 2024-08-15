const mongoose = require('mongoose');
const { Festival, Product } = require('../../../models/dbModels');

const { isAdmin } = require('../../../lib/Functions');


const FestivalCreate = async (args, context) => {
    const {
        productId,
        offPercentage,
        until
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

        if (!(await isAdmin(userInfo?.userId)) && !product.sellerId.equals(new mongoose.Types.ObjectId(userInfo?.userId))) {
            return {
                message: "You are not authorized!",
                status: 403
            }
        }

        if (typeof offPercentage !== 'number' || typeof until !== 'string') return {
            message: "offPercentage and until is required",
            status: 400
        }

        const newFestival = new Festival({
            productId,
            offPercentage,
            until
        })

        newFestival.save();

        return {
            message: "Festival Has Been Created Successfully!",
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
    FestivalCreate
}