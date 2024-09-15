const { TemporaryImage } = require("../../models/dbModels");
const { deleteImages } = require("../image/delete");


const deleteOldTemporaryImages = async () => {
    try {

        const date = new Date()
        date.setHours(date.getHours() - 3)   // clear the temp images which created before 3 hours ago
        const files = await TemporaryImage.find({
            createdAt: {
                $lt: date,
            },
        }).exec();
        const filenames = files.map(obj => obj.name)

        await deleteImages({ filenames }, { userInfo: null }, true)
        await TemporaryImage.deleteMany({
            createdAt: {
                $lt: date,
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