const { Product } = require('../../models/dbModels');


const getAllProducts = async (_parent, args, context) => {

    const { page, perPage } = args;
    if (!page || !perPage)
        return await Product.find({});
    const skip = (page - 1) * perPage;
    return await Product.find({}).skip(skip).limit(perPage);

}

const getProductsCount = async (_parent, _args, context) => {
    return await Product.where().countDocuments().exec();

}

const getOneProduct = async (_parent, args, context) => {
    const { id } = args
    return await Product.findById(id);
}


module.exports = {

}