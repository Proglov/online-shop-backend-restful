const { CompanyCouponForSomeProducts } = require('../../../models/dbModels');
const { isAdmin } = require('../../../lib/Functions');


const DeleteOneCompanyCouponForSomeProducts = async (args, context) => {
    const { id } = args;
    const { userInfo } = context;

    try {
        if (!userInfo) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }

        const existingCompanyCouponForSomeProducts = await CompanyCouponForSomeProducts.findById(id).populate({ path: "productsIds", select: 'sellerId' });

        if (!existingCompanyCouponForSomeProducts) return {
            message: "CompanyCouponForSomeProducts doesn't exist",
            status: 400
        }

        if (!(await isAdmin(userInfo?.userId)) && existingCompanyCouponForSomeProducts?.productsIds[0].sellerId != userInfo?.userId) return {
            message: "You are not authorized!",
            status: 403
        }

        await CompanyCouponForSomeProducts.findByIdAndDelete(id)

        return {
            message: "CompanyCouponForSomeProducts Has Been Deleted Successfully!",
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
    DeleteOneCompanyCouponForSomeProducts
}