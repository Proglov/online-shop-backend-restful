const express = require('express');

const router = express.Router();

const {
    WarehouseCreate
} = require('../../controller/warehouse/post');


router.post('/WarehouseCreate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, warehouse } = await WarehouseCreate({ ...input }, { userInfo });

    res.status(status).json({ message, warehouse });
})




module.exports = router;