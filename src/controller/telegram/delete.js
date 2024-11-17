const { TemporaryTelegramCode } = require('../../models/dbModels');
const { error500 } = require('../../lib/errors');



const AllTelegramCodesDelete = async () => {
    try {
        await TemporaryTelegramCode.deleteMany()

        return {
            message: 'The codes has been deleted successfully',
            status: 201
        }

    } catch (error) {
        return {
            ...error500
        }
    }
}


module.exports = {
    AllTelegramCodesDelete
}