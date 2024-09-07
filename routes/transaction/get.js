const express = require('express');

const router = express.Router();

const {
    getAllTransActions,
    getAllMyTransActions,
    getAllMyTransActionsUser,
    getAllTransActionsOfAUser,
    getAllTransActionsOfAProduct,
    getOneTransAction
} = require('../../controller/transactions/get');


router.get('/getAllTransActions', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transactions, message, transactionsCount } = await getAllTransActions(args, { userInfo })

    res.status(status).send({ transactions, message, transactionsCount });
})

router.get('/getAllMyTransActions', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transactions, message, transactionsCount } = await getAllMyTransActions(args, { userInfo })

    res.status(status).send({ transactions, message, transactionsCount });
})

router.get('/getAllMyTransActionsUser', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transactions, message } = await getAllMyTransActionsUser(args, { userInfo })

    res.status(status).send({ transactions, message });
})

router.get('/getAllTransActionsOfAUser', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transactions, message, transactionsCount } = await getAllTransActionsOfAUser(args, { userInfo })

    res.status(status).send({ transactions, message, transactionsCount });
})

router.get('/getAllTransActionsOfAProduct', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transactions, message, transactionsCount } = await getAllTransActionsOfAProduct(args, { userInfo })

    res.status(status).send({ transactions, message, transactionsCount });
})

router.get('/getOneTransAction', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, transaction, message } = await getOneTransAction(args, { userInfo })

    res.status(status).send({ transaction, message });
})



module.exports = router;