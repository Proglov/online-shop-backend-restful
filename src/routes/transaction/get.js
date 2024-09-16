const express = require('express');

const router = express.Router();

const {
    getAllTransActions,
    getAllTransActionsOfASeller,
    getAllMyTransActions,
    getAllMyTransActionsUser,
    getAllTransActionsOfAUser,
    getAllTransActionsOfAProduct,
    getOneTransAction
} = require('../../controller/transactions/get');
const { getQueryArgs } = require('../../lib/Functions');


router.get('/getAllTransActions', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        isFutureOrder: 'string'
    })

    const { status, transactions, message, transactionsCount } = await getAllTransActions(args, { userInfo })

    res.status(status).json({ transactions, message, transactionsCount });
})

router.get('/getAllTransActionsOfASeller', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        id: 'string'
    })

    const { status, transactions, message, transactionsCount } = await getAllTransActionsOfASeller(args, { userInfo })

    res.status(status).json({ transactions, message, transactionsCount });
})

router.get('/getAllMyTransActions', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        isFutureOrder: 'string'
    })

    const { status, transactions, message, transactionsCount } = await getAllMyTransActions(args, { userInfo })

    res.status(status).json({ transactions, message, transactionsCount });
})

router.get('/getAllMyTransActionsUser', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { status, transactions, message } = await getAllMyTransActionsUser(args, { userInfo })

    res.status(status).json({ transactions, message });
})

router.get('/getAllTransActionsOfAUser', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        id: 'string'
    })

    const { status, transactions, message, transactionsCount } = await getAllTransActionsOfAUser(args, { userInfo })

    res.status(status).json({ transactions, message, transactionsCount });
})

router.get('/getAllTransActionsOfAProduct', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        id: 'string'
    })

    const { status, transactions, message, transactionsCount } = await getAllTransActionsOfAProduct(args, { userInfo })

    res.status(status).json({ transactions, message, transactionsCount });
})

router.get('/getOneTransAction', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        id: 'string'
    })

    const { status, transaction, message } = await getOneTransAction(args, { userInfo })

    res.status(status).json({ transaction, message });
})



module.exports = router;