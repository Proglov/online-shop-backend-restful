const { Subcategory } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');


const SubcategoryCreate = async (args, context) => {
    const {
        name,
        categoryId,
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

        if (!categoryId) return {
            message: "categoryId is required",
            status: 400
        }

        const newSubcategory = new Subcategory({
            name,
            categoryId
        })

        await newSubcategory.save();

        return {
            message: 'The Subcategory has been created successfully',
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
    SubcategoryCreate
}