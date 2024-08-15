const { Festival } = require('../../../models/dbModels');
const { isAdmin } = require('../../../lib/Functions');


const FestivalsDelete = async (_args, _context) => {
    try {
        const now = Date.now()
        const conditionQuery = { until: { $lte: now } }

        await Festival.deleteMany(conditionQuery)

        return {
            message: "Old Festival Has Been Deleted Successfully!",
            status: 200
        }

    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }
}

const DeleteOneFestival = async (args, context) => {
    const { id } = args;
    const { userInfo } = context;

    try {
        if (!userInfo) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }

        const existingFestival = await Festival.findById(id).populate({ path: "productId", select: 'sellerId' });

        if (!existingFestival) return {
            message: "Festival doesn't exist",
            status: 400
        }

        if (!(await isAdmin(userInfo?.userId)) && existingFestival?.productId.sellerId != userInfo?.userId) return {
            message: "You are not authorized!",
            status: 403
        }

        await Festival.findByIdAndDelete(id)

        return {
            message: "Festival Has Been Deleted Successfully!",
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
    FestivalsDelete,
    DeleteOneFestival
}