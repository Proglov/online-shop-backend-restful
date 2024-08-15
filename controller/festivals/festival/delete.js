const { Festival } = require('../../../models/dbModels');


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



module.exports = {
    FestivalsDelete
}