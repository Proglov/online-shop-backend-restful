const express = require('express');
const {
    getAllWarehouses,
    getAllMyWarehouses,
    getAllWarehousesOfASeller
} = require('../../controller/warehouse/get');

const { setUserInfo } = require('../../lib/middlewares');
const { getQueryArgs } = require('../../lib/Functions');

const router = express.Router();

router.get('/getAllWarehouses', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { warehouses, allWarehousesCount, status, message } = await getAllWarehouses(args, null)

    res.status(status).json({ warehouses, allWarehousesCount, message });
})

router.get('/getAllMyWarehouses', setUserInfo, async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { warehouses, allWarehousesCount, status, message } = await getAllMyWarehouses(args, { userInfo })

    res.status(status).json({ warehouses, allWarehousesCount, message });
})

router.get('/getAllWarehousesOfASeller', setUserInfo, async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        id: 'string'
    })

    const { warehouses, allWarehousesCount, status, message } = await getAllWarehousesOfASeller(args, { userInfo })

    res.status(status).json({ warehouses, allWarehousesCount, message });
})

module.exports = router;