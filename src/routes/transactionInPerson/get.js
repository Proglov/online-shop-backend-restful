const express = require('express');

const router = express.Router();

const {
    getAllTransActionInPersons,
    getAllTransActionInPersonsOfASeller,
    getAllMyTransActionInPersons
} = require('../../controller/transactionInPersons/get');
const { getQueryArgs } = require('../../lib/Functions');


router.get('/getAllTransActionInPersons', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { status, transactions, message, transactionsCount } = await getAllTransActionInPersons(args, { userInfo })

    res.status(status).json({ transactions, message, transactionsCount });
})

router.get('/getAllTransActionInPersonsOfASeller', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        id: 'string'
    })

    const { status, transactions, message, transactionsCount } = await getAllTransActionInPersonsOfASeller(args, { userInfo })

    res.status(status).json({ transactions, message, transactionsCount });
})

router.get('/getAllMyTransActionInPersons', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { status, transactions, message, transactionsCount } = await getAllMyTransActionInPersons(args, { userInfo })

    res.status(status).json({ transactions, message, transactionsCount });
})



module.exports = router;