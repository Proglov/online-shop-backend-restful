const { MajorShopping } = require('../../../models/dbModels');
const { isAdmin } = require('../../../lib/Functions');

const DeleteOneMajorShopping = async (args, context) => {
    const { id } = args;
    const { userInfo } = context;

    try {
        if (!userInfo) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }

        const existingMajorShopping = await MajorShopping.findById(id).populate({ path: "productId", select: 'sellerId' });

        if (!existingMajorShopping) return {
            message: "MajorShopping doesn't exist",
            status: 400
        }

        if (!(await isAdmin(userInfo?.userId)) && existingMajorShopping?.productId.sellerId != userInfo?.userId) return {
            message: "You are not authorized!",
            status: 403
        }

        await MajorShopping.findByIdAndDelete(id)

        return {
            message: "MajorShopping Has Been Deleted Successfully!",
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
    DeleteOneMajorShopping
}