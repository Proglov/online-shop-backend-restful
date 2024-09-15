const { Seller } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');

const SellerDelete = async (args, context) => {
    const { id } = args;
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            return {
                id: null,
                message: "You are not authorized!",
                status: 400
            }
        }

        //don't let the user if they're neither admin
        if (!(await isAdmin(userInfo?.userId))) {
            return {
                id: null,
                message: "You are not authorized!",
                status: 403
            }
        }

        const seller = await Seller.findByIdAndDelete(id)

        return {
            id,
            message: `Seller ${seller.id} has been deleted`,
            status: 202
        }


    } catch (error) {
        return {
            id: null,
            message: error,
            status: 500
        }
    }



}


module.exports = {
    SellerDelete
}