const { TemporaryImage } = require("../../models/dbModels");
const { deleteImages } = require("../image/delete");


const deleteOldTemporaryImages = async (args) => {
    const { cutoffDate } = args
    try {
        const files = await TemporaryImage.find({
            createdAt: {
                $lt: cutoffDate,
            },
        }).exec();
        const filenames = files.map(obj => obj.name)

        await deleteImages({ filenames }, { userInfo: null }, true)
        await TemporaryImage.deleteMany({
            createdAt: {
                $lt: cutoffDate,
            }
        });
        return { message: 'temporary images deleted', status: 200 }
    } catch (error) {
        console.log(error);
        return { message: error, status: 500 }
    }
}

module.exports = {
    deleteOldTemporaryImages
}