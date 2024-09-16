const express = require('express');

const router = express.Router();

const {
    TransActionStatus
} = require('../../controller/transactions/update');


router.post('/TransActionStatus', async (req, res) => {
    const userInfo = req?.userInfo
    const { id, newStatus } = req.body

    const { status, message, transaction } = await TransActionStatus({ id, newStatus }, { userInfo });

    res.status(status).json({ message, transaction });
})


module.exports = router;