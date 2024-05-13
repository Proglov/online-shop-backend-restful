const { Product } = require('../../models/dbModels');


const getAllProducts = async (args, _context) => {

    let { page, perPage } = args;

    try {
        const allProductsCount = await Product.where().countDocuments().exec();

        if (!page || !perPage) {
            const products = await Product.find({});
            return {
                products,
                allProductsCount,
                status: 200,
                error: null
            }
        }

        page = parseInt(page);
        perPage = parseInt(perPage);
        const skip = (page - 1) * perPage;
        const products = await Product.find({}).skip(skip).limit(perPage);
        return {
            products,
            allProductsCount,
            status: 200,
            error: null
        }

    } catch (error) {
        return {
            products: null,
            allProductsCount: 0,
            status: 500,
            error
        }
    }

}

const getOneProduct = async (args, _context) => {
    const { id } = args
    try {
        const product = await Product.findById(id);
        return {
            product,
            status: 200,
            error: null
        }
    } catch (error) {
        return {
            product: null,
            status: 500,
            error
        }
    }

}


module.exports = {
    getAllProducts,
    getOneProduct
}