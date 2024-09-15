const express = require('express');

const router = express.Router();

const {
    getMeSeller,
    getSeller,
    getSellers,
    isUserSeller
} = require('../../controller/sellers/get');
const { getQueryArgs } = require('../../lib/Functions');


router.get('/getMeSeller', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, seller, message } = await getMeSeller(null, { userInfo })

    res.status(status).json({ seller, message });
})


router.get('/getSeller', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, { id: 'string' })

    const { status, seller, message } = await getSeller(args, { userInfo })

    res.status(status).json({ seller, message });
})


router.get('/getSellers', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        validated: 'string'
    })

    const { status, sellers, message, allSellersCount } = await getSellers(args, { userInfo })

    res.status(status).json({ sellers, message, allSellersCount });
})


router.get('/isUserSeller', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, isSeller, message } = await isUserSeller(null, { userInfo })

    res.status(status).json({ isSeller, message });
})


module.exports = router;