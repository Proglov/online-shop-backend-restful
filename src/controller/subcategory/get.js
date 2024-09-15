const { Subcategory } = require('../../models/dbModels');


const getAllSubcategories = async (args, _context) => {

    let { page, perPage } = args;

    try {
        const allSubcategoriesCount = await Subcategory.where().countDocuments().exec();

        if (!page || !perPage) {
            const subcategories = await Subcategory.find({}).populate({ path: "categoryId", select: 'name' });

            return {
                subcategories,
                allSubcategoriesCount,
                status: 200,
                message: null
            }
        }

        page = parseInt(page);
        perPage = parseInt(perPage);
        const skip = (page - 1) * perPage;
        const subcategories = await Subcategory.find({}).populate({ path: "categoryId", select: 'name' }).skip(skip).limit(perPage);
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
    try {
        const subcategory = await Subcategory.findById(id).populate({ path: "categoryId", select: 'name' });
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