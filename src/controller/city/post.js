const { City, Province } = require('../../models/dbModels');

const { isAdmin } = require('../../lib/Functions');
const { error401, error500 } = require('../../lib/errors');


const CityCreate = async (args, context) => {
    const {
        name,
        provinceId,
    } = args;

    const { userInfo } = context;


    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                ...error401,
                city: null
            }
        }


        if (!(await isAdmin(userInfo?.userId))) {
            return {
                ...error401,
                city: null
            }
        }

        if (!name) return {
            city: null,
            message: "name is required",
            status: 400
        }

        if (!provinceId) return {
            city: null,
            message: "provinceId is required",
            status: 400
        }

        const province = await Province.findById(provinceId)
        if (!province) return {
            city: null,
            message: "provinceId is required",
            status: 400
        }

        const newCity = new City({
            name,
            provinceId
        })

        await newCity.save();

        newCity.provinceId.name = province.name
        return {
            city: { name: newCity.name, _id: newCity._id, provinceId: { name: province.name } },
            message: 'The City has been created successfully',
            status: 201
        }

    } catch (error) {
        return {
            ...error500,
            city: null
        }
    }
}



module.exports = {
    CityCreate
}