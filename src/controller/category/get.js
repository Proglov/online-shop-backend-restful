const { Category } = require('../../models/dbModels');
const { getImage } = require('../image/get');


const getCategoriesWithTrueImageUrl = async (input) => {
    if (Array.isArray(input)) {
        const newCategories = [];

        for (const category of input) {
            if (!!category.imageUrl) {
                const filename = category.imageUrl
                const args = { filename };
                const { url } = await getImage(args, null);

                const updatedCategory = {
                    ...category,
                    imageUrl: url,
                    imageName: filename
                };
                newCategories.push(updatedCategory);
            } else {
                newCategories.push(category);
            }

        }
        return newCategories;

    } else if (typeof input === 'object') {
        if (!!input.imageUrl) {
            const filename = input.imageUrl
            const args = { filename };
            const { url } = await getImage(args, null);

            return {
                ...input,
                imageUrl: url,
                imageName: filename
            };
        }
        return input
    }

    return null; // Invalid input
};


const getAllCategories = async (args, _context) => {
    const { page, perPage } = args;

    try {
        const skip = (page - 1) * perPage;

        const query = Category.find({}).skip(skip).limit(perPage)

        let allCategoriesCount = 0
        const Categories = await query.lean().exec();

        if (!skip && skip !== 0) allCategoriesCount = Categories.length
        else allCategoriesCount = await Category.where().countDocuments().exec();

        const newCategories = await getCategoriesWithTrueImageUrl(Categories);

        return {
            categories: newCategories,
            allCategoriesCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            categories: null,
            allCategoriesCount: 0,
            status: 500,
            message: error
        }
    }

}

const getOneCategory = async (args, _context) => {
    const { id } = args
    if (!id) {
        return {
            category: null,
            message: "Category ID is required",
            status: 400,
        };
    }

    try {
        const category = await Category.findById(id).lean().exec();
        const newCategory = await getCategoriesWithTrueImageUrl(category);
        return {
            category: newCategory,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            category: null,
            status: 500,
            message: error
        }
    }

}


module.exports = {
    getAllCategories,
    getOneCategory
}