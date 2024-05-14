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


router.get('/getOneTransAction', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transaction, message } = await getOneTransAction(args, { userInfo })

    res.status(status).send({ transaction, message });
})



module.exports = router;