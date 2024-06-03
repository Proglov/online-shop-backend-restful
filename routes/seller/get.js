const express = require('express');

const router = express.Router();

const {
    getMeSeller,
    getSeller,
    getSellers,
    isUserSeller
} = require('../../controller/sellers/get');


router.get('/getMeSeller', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, seller, message } = await getMeSeller(null, { userInfo })

    res.status(status).send({ seller, message });
})


router.get('/getSeller', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, seller, message } = await getSeller(args, { userInfo })

    res.status(status).send({ seller, message });
})


router.get('/getSellers', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, sellers, message, allSellersCount } = await getSellers(args, { userInfo })

    res.status(status).send({ sellers, message, allSellersCount });
})


router.get('/isUserSeller', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, isSeller, message } = await isUserSeller(null, { userInfo })

    res.status(status).send({ isSeller, message });
})


module.exports = router;