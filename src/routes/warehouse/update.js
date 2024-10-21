const express = require('express');

const router = express.Router();

const {
    WarehouseUpdate,
} = require('../../controller/warehouse/update');


router.patch('/WarehouseUpdate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, warehouse } = await WarehouseUpdate({ ...input }, { userInfo })

    res.status(status).json({ message, warehouse });
})



module.exports = router;