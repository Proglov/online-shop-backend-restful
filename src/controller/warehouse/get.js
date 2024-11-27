const { Warehouse } = require('../../models/dbModels');
const { error500, error401 } = require('../../lib/errors');


const getAllWarehouses = async (args, _context) => {
    const { page, perPage } = args;
    try {
        const skip = (page - 1) * perPage;

        const query = Warehouse.find({}).populate({
            path: "cityId", select: 'provinceId name', populate: {
                path: 'provinceId',
                select: 'name'
            },
        }).populate({ path: "citiesCovered", select: 'name' }).populate({ path: "sellerId", select: 'name' }).skip(skip).limit(perPage)

        let allWarehousesCount = 0
        const warehouses = await query.lean().exec();

        if (!skip && skip !== 0) allWarehousesCount = warehouses.length
        else allWarehousesCount = await Warehouse.where().countDocuments().exec();

        return {
            warehouses,
            allWarehousesCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            ...error500,
            warehouses: null,
            allWarehousesCount: 0
        }
    }
}

const getAllMyWarehouses = async (args, context) => {
    let { page, perPage } = args;
    let { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                ...error401,
                warehouses: null,
                allWarehousesCount: 0,
            }
        }

        const skip = (page - 1) * perPage;
        const condition = { sellerId: userInfo?.userId }
        const query = Warehouse.find(condition).populate({
            path: "cityId",
            select: 'provinceId name',
            populate: {
                path: 'provinceId',
                select: 'name'
            },
        }).skip(skip).limit(perPage)

        let allWarehousesCount = 0
        const warehouses = await query.lean().exec();

        if (!skip && skip !== 0) allWarehousesCount = warehouses.length
        else allWarehousesCount = await Warehouse.where(condition).countDocuments().exec();

        return {
            warehouses,
            allWarehousesCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            ...error500,
            warehouses: null,
            allWarehousesCount: 0
        }
    }
}

const getAllWarehousesOfASeller = async (args, context) => {
    let { page, perPage, id } = args;
    let { userInfo } = context;

    try {
        if (!userInfo || !userInfo?.userId) {
            return {
                ...error401,
                warehouses: null,
                allWarehousesCount: 0,
            }
        }

        const skip = (page - 1) * perPage;
        const condition = { sellerId: id }
        const query = Warehouse.find(condition).populate({
            path: "cityId", select: 'provinceId name', populate: {
                path: 'provinceId',
                select: 'name'
            },
        }).skip(skip).limit(perPage)

        let allWarehousesCount = 0
        const warehouses = await query.lean().exec();

        if (!skip && skip !== 0) allWarehousesCount = warehouses.length
        else allWarehousesCount = await Warehouse.where(condition).countDocuments().exec();

        return {
            warehouses,
            allWarehousesCount,
            status: 200,
            message: null
        }

    } catch (error) {
        return {
            ...error500,
            warehouses: null,
            allWarehousesCount: 0
        }
    }
}


module.exports = {
    getAllWarehouses,
    getAllMyWarehouses,
    getAllWarehousesOfASeller
}