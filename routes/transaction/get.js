const express = require('express');

const router = express.Router();

const {
    getAllTransActions,
    getOneTransAction
} = require('../../controller/transactions/get');


router.get('/getAllTransActions', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transactions, message, transactionsCount } = await getAllTransActions(args, { userInfo })

    res.status(status).send({ transactions, message, transactionsCount });
})



module.exports = router;