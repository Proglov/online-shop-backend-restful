const { Province } = require('../../models/dbModels');
const { isAdmin } = require('../../lib/Functions');
const { error401, error500 } = require('../../lib/errors');


const ProvinceCreate = async (args, context) => {
    const {
        name,
    } = args;

    const { userInfo } = context;


    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                ...error401,
                province: null
            }
        }


        if (!(await isAdmin(userInfo?.userId))) {
            return {
                ...error401,
                province: null
            }
        }

        if (!name) return {
            province: null,
            message: "name is required",
            status: 400
        }

        const newProvince = new Province({ name })

        await newProvince.save();

        return {
            province: newProvince,
            message: 'The province has been created successfully',
            status: 201
        }

    } catch (error) {
        return {
            ...error500,
            province: null
        }
    }
}



module.exports = {
    ProvinceCreate
}