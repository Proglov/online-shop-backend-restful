const { Warehouse, City } = require('../../models/dbModels');
const { isAdmin } = require('../../lib/Functions');
const { error401, error500 } = require('../../lib/errors');

const WarehouseUpdate = async (args, context) => {
    const {
        id,
        name,
        cityId,
        completeAddress,
        citiesCovered
    } = args;
    const { userInfo } = context;

    if (!id) return {
        warehouse: null,
        message: 'id is required',
        status: 400
    }
    try {
        if (!userInfo) {
            return {
                ...error401,
                warehouse: null
            }
        }

        const existingWarehouse = await Warehouse.findById(id).populate({
            path: "cityId",
            select: 'provinceId name',
            populate: {
                path: 'provinceId name'
            },
        });

        if (!existingWarehouse) {
            return {
                warehouse: null,
                message: "Warehouse doesn't exist",
                status: 400
            }
        }

        if (!(await isAdmin(userInfo?.userId)) && existingWarehouse?.sellerId != userInfo?.userId) {
            return {
                ...error401,
                warehouse: null
            }
        }

        if (!!name) {
            existingWarehouse.name = name
        }

        if (!!completeAddress) {
            existingWarehouse.completeAddress = completeAddress
        }

        if (!!price) {
            existingWarehouse.price = price
        }

        if (!!cityId) {
            const city = await City.findById(cityId);
            if (!!city)
                existingWarehouse.cityId = cityId
        }

        if (citiesCovered !== undefined && citiesCovered !== null && Array.isArray(citiesCovered)) {
            existingWarehouse.citiesCovered = citiesCovered
        }

        return {
            warehouse: {
                _id: id,
                name: existingWarehouse.name,
                completeAddress: existingWarehouse.completeAddress,
                citiesCovered: newProd.citiesCovered,
                cityId: {
                    name: existingWarehouse.city.name,
                    provinceId: {
                        name: existingWarehouse.city.provinceId.name,
                    }
                }
            },
            message: "Warehouse updated successfully",
            status: 202
        }

    } catch (error) {
        return {
            error500,
            warehouse: null
        }
    }
}

module.exports = {
    WarehouseUpdate,
}