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
                    ...category?._doc,
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
                ...input?._doc,
                imageUrl: url,
                imageName: filename
            };
        }
        return input
    }

    return null; // Invalid input
};


const getAllCategories = async (args, _context) => {

    let { page, perPage } = args;

    try {
        const allCategoriesCount = await Category.where().countDocuments().exec();

        if (!page || !perPage) {
            const Categories = await Category.find({});

            const newCategories = await getCategoriesWithTrueImageUrl(Categories);

            return {
                categories: newCategories,
                allCategoriesCount,
                status: 200,
                message: null
            }
        }
        page = parseInt(page);
        perPage = parseInt(perPage);
        const skip = (page - 1) * perPage;
        const Categories = await Category.find({}).skip(skip).limit(perPage);
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
    try {
        const category = await Category.findById(id);
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