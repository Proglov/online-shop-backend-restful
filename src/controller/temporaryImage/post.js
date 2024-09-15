const { TemporaryImage } = require("../../models/dbModels");


const addTemporaryImage = async (args) => {
    const { filename } = args
    try {
        const tempImage = new TemporaryImage({ name: filename })
        await tempImage.save()
        return { message: 'success', status: 201 }
    } catch (error) {
        return { message: error, status: 500 }
    }
}


module.exports = {
    addTemporaryImage
}