const { Subcategory, Category } = require('../../models/dbModels');

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
                subcategory: null,
                message: "You are not authorized!",
                status: 400
            }
        }


        if (!(await isAdmin(userInfo?.userId))) {
            return {
                subcategory: null,
                message: "You are not authorized!",
                status: 403
            }
        }

        if (!name) return {
            subcategory: null,
            message: "name is required",
            status: 400
        }

        if (!categoryId) return {
            subcategory: null,
            message: "categoryId is required",
            status: 400
        }

        const category = await Category.findById(categoryId)
        if (!category) return {
            subcategory: null,
            message: "categoryId is required",
            status: 400
        }

        const newSubcategory = new Subcategory({
            name,
            categoryId
        })

        await newSubcategory.save();

        newSubcategory.categoryId.name = category.name
        return {
            subcategory: { name: newSubcategory.name, _id: newSubcategory._id, categoryId: { name: category.name } },
            message: 'The Subcategory has been created successfully',
            status: 201
        }

    } catch (error) {
        return {
            subcategory: null,
            message: error,
            status: 500
        }
    }


}



module.exports = {
    SubcategoryCreate
}