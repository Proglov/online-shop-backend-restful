const { error500 } = require('../../lib/errors');
const { City } = require('../../models/dbModels');


const getAllCities = async (args, _context) => {
    const { page, perPage } = args;

    try {

        const skip = (page - 1) * perPage;
        const query = City.find().populate({ path: "provinceId", select: 'name' }).skip(skip).limit(perPage)

        let allCitiesCount = 0
        const cities = await query.lean().exec();

        if (!skip) allCitiesCount = cities.length
        else allCitiesCount = await City.where().countDocuments().exec();

        return {
            cities,
            allCitiesCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            ...error500,
            cities: null,
            allCitiesCount: 0
        }
    }

}

const getOneCity = async (args, _context) => {
    const { id } = args
    if (!id) {
        return {
            product: null,
            message: "City ID is required",
            status: 400,
        };
    }

    try {
        const city = await City.findById(id).populate({ path: "provinceId", select: 'name' }).lean().exec();
        return {
            city,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            ...error500,
            city: null
        }
    }

}


module.exports = {
    getAllCities,
    getOneCity
}