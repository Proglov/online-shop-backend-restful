const { Subcategory } = require('../../models/dbModels');


const getAllSubcategories = async (args, _context) => {
    const { page, perPage } = args;

    try {

        const skip = (page - 1) * perPage;
        const query = Subcategory.find().populate({ path: "categoryId", select: 'name' }).skip(skip).limit(perPage)

        let allSubcategoriesCount = 0
        const subcategories = await query.lean().exec();

        if (!skip) allSubcategoriesCount = subcategories.length
        else allSubcategoriesCount = await Subcategory.where().countDocuments().exec();

        return {
            subcategories,
            allSubcategoriesCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            subcategories: null,
            allSubcategoriesCount: 0,
            status: 500,
            message: error
        }
    }

}

const getOneSubcategory = async (args, _context) => {
    const { id } = args
    if (!id) {
        return {
            product: null,
            message: "Subcategory ID is required",
            status: 400,
        };
    }

    try {
        const subcategory = await Subcategory.findById(id).populate({ path: "categoryId", select: 'name' }).lean().exec();
        return {
            subcategory,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            subcategory: null,
            status: 500,
            message: error
        }
    }

}


module.exports = {
    getAllSubcategories,
    getOneSubcategory
}