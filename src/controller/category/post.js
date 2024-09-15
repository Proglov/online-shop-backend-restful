const { Category } = require('../../models/dbModels');
const { isAdmin } = require('../../lib/Functions');
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

const CategoryCreate = async (args, context) => {
    const {
        name,
        imageUrl,
    } = args;

    const { userInfo } = context;


    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                category: null,
                message: "You are not authorized!",
                status: 400
            }
        }


        if (!(await isAdmin(userInfo?.userId))) {
            return {
                category: null,
                message: "You are not authorized!",
                status: 403
            }
        }

        if (!name) return {
            category: null,
            message: "name is required",
            status: 400
        }

        const newCategory = new Category({
            name,
            imageUrl
        })

        await newCategory.save();

        const category = await getCategoriesWithTrueImageUrl(newCategory)

        return {
            category,
            message: 'The category has been created successfully',
            status: 201
        }

    } catch (error) {
        return {
            category: null,
            message: error,
            status: 500
        }
    }

}



module.exports = {
    CategoryCreate
}