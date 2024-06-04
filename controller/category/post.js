const { Category } = require('../../models/dbModels');


const { isAdmin } = require('../../lib/Functions');

const CategoryCreate = async (args, context) => {
    const {
        name,
        imageUrl,
    } = args;

    const { userInfo } = context;


    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                message: "You are not authorized!",
                status: 400
            }
        }


        if (!(await isAdmin(userInfo?.userId))) {
            return {
                message: "You are not authorized!",
                status: 403
            }
        }

        if (!name) return {
            message: "name is required",
            status: 400
        }

        const newCategory = new Category({
            name,
            imageUrl
        })

        await newCategory.save();

        return {
            message: 'The category has been created successfully',
            status: 201
        }

    } catch (error) {
        return {
            message: error,
            status: 500
        }
    }



}



module.exports = {
    CategoryCreate
}