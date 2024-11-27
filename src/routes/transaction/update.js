const express = require('express');

const router = express.Router();

const {
    TransActionStatus,
    CancelTXByUser,
    CancelTXBySeller,
    OpinionTX
} = require('../../controller/transactions/update');


router.post('/TransActionStatus', async (req, res) => {
    const userInfo = req?.userInfo
    const { id, newStatus } = req.body

    const { status, message, transaction } = await TransActionStatus({ id, newStatus }, { userInfo });

    res.status(status).json({ message, transaction });
})

router.post('/CancelTXByUser', async (req, res) => {
    const userInfo = req?.userInfo
    const { id, reason } = req.body

    const { status, message, transaction } = await CancelTXByUser({ id, reason }, { userInfo });

    res.status(status).json({ message, transaction });
})

router.post('/CancelTXBySeller', async (req, res) => {
    const userInfo = req?.userInfo
    const { id, reason } = req.body

    const { status, message, transaction } = await CancelTXBySeller({ id, reason }, { userInfo });

    res.status(status).json({ message, transaction });
})

router.post('/OpinionTX', async (req, res) => {
    const userInfo = req?.userInfo
    const { id, rate, comment } = req.body

    const { status, message, transaction } = await OpinionTX({ id, rate, comment }, { userInfo });

    res.status(status).json({ message, transaction });
})

module.exports = router;