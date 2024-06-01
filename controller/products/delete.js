const { Product } = require('../../models/dbModels');
const {
    deleteImages
} = require('../image/delete');
const { isAdmin } = require('../../lib/Functions');

const ProductDelete = async (args, context) => {

    const { id } = args;
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

        const filenames = existingProduct.imagesUrl;

        if (filenames != null && filenames != undefined && filenames?.length !== 0)
            await deleteImages({ filenames }, null);

        await Product.findByIdAndDelete(id)

        return {
            message: "Product has been deleted successfully",
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
    ProductDelete
}