const express = require('express');

const router = express.Router();

const {
    getAllTransActionInPersons,
    getAllTransActionInPersonsOfASeller,
    getAllMyTransActionInPersons
} = require('../../controller/transactionInPersons/get');


router.get('/getAllTransActionInPersons', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transactions, message, transactionsCount } = await getAllTransActionInPersons(args, { userInfo })

    res.status(status).send({ transactions, message, transactionsCount });
})

router.get('/getAllTransActionInPersonsOfASeller', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transactions, message, transactionsCount } = await getAllTransActionInPersonsOfASeller(args, { userInfo })

    res.status(status).send({ transactions, message, transactionsCount });
})

router.get('/getAllMyTransActionInPersons', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transactions, message, transactionsCount } = await getAllMyTransActionInPersons(args, { userInfo })

    res.status(status).send({ transactions, message, transactionsCount });
})



module.exports = router;