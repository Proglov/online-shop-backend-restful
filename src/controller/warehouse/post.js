const { Warehouse, Seller, City } = require('../../models/dbModels');
const { isAdmin } = require('../../lib/Functions');
const { error401, error500 } = require('../../lib/errors');


const WarehouseCreate = async (args, context) => {
    const {
        name,
        cityId,
        completeAddress,
        citiesCovered
    } = args;

    const { userInfo } = context;


    try {

        if (!userInfo || !userInfo?.userId) {
            return {
                ...error401,
                warehouse: null
            }
        }

        const seller = await Seller.findById(userInfo?.userId)

        if (!(await isAdmin(userInfo?.userId)) && !seller) {
            return {
                ...error401,
                warehouse: null
            }
        }

        const city = await City.findById(cityId).populate({ path: "provinceId", select: 'name' });

        if (!city)
            return {
                message: "شهر ضروریست",
                status: 400,
                warehouse: null
            }

        if (!completeAddress || completeAddress?.length < 5)
            return {
                message: "ادرس کامل ضروریست",
                status: 400,
                warehouse: null
            }
        if (!citiesCovered || !citiesCovered?.length)
            return {
                message: "شهر های پوشش داده شده ضروریست",
                status: 400,
                warehouse: null
            }
        if (!name)
            return {
                message: "نام انبار ضروریست",
                status: 400,
                warehouse: null
            }

        const existingWareHouse = await Warehouse.findOne({ sellerId: userInfo?.userId, name })

        if (existingWareHouse)
            return {
                message: "نام انبار تکراریست",
                status: 400,
                warehouse: null
            }

        const newWarehouse = new Warehouse({
            name,
            completeAddress,
            citiesCovered,
            cityId,
            sellerId: userInfo?.userId,
        })

        await newWarehouse.save();

        return {
            warehouse: {
                name,
                completeAddress,
                citiesCovered,
                cityId: {
                    name: city.name,
                    provinceId: {
                        name: city.provinceId.name,
                    }
                }
            },
            message: 'The warehouse has been created successfully',
            status: 201
        }

    } catch (error) {
        return {
            ...error500,
            warehouse: null
        }
    }
}


module.exports = {
    WarehouseCreate
}