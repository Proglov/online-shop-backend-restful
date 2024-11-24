const { TemporaryImage } = require("../../models/dbModels");
const { deleteImages } = require("../image/delete");


const deleteSomeTemporaryImages = async (filenames) => {
    if (Array.isArray(filenames) && filenames.length > 0) {
        try {
            await deleteImages({ filenames }, { userInfo: null }, true)
            await TemporaryImage.deleteMany({
                name: {
                    $in: filenames
                }
            });
            return { message: 'temporary images deleted', status: 200 }
        } catch (error) {
            console.log(error);
            return { message: error, status: 500 }
        }
    }

    return {
        message: 'no file is passed',
        status: 202
    }
}

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
    deleteSomeTemporaryImages,
    deleteOldTemporaryImages
}