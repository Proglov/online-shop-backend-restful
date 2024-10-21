const { error500 } = require('../../lib/errors');
const { Province } = require('../../models/dbModels');


const getAllProvinces = async (args, _context) => {
    const { page, perPage } = args;

    try {
        const skip = (page - 1) * perPage;

        const query = Province.find({}).skip(skip).limit(perPage)

        let allProvincesCount = 0
        const provinces = await query.lean().exec();

        if (!skip) allProvincesCount = provinces.length
        else allProvincesCount = await Province.where().countDocuments().exec();

        return {
            provinces,
            allProvincesCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            ...error500,
            provinces: null,
            allProvincesCount: 0
        }
    }

}

const getOneProvince = async (args, _context) => {
    const { id } = args
    if (!id) {
        return {
            province: null,
            message: "Province ID is required",
            status: 400,
        };
    }

    try {
        const province = await Province.findById(id).lean().exec();

        return {
            province,
            status: 200,
            message: null
        }
    } catch (error) {
        return {
            ...error500,
            province: null
        }
    }

}


module.exports = {
    getAllProvinces,
    getOneProvince
}