const express = require('express');
const { setUserInfo } = require('../../lib/middlewares');

const router = express.Router();

const { GetAllFestivalProducts, GetAllMyFestivalProducts } = require('../../controller/discounts/festival/get');
const { GetAllMajorShoppingProducts, GetMyAllMajorShoppingProducts } = require('../../controller/discounts/majorShopping/get');
const { GetAllMyCompanyCouponForSomeProducts, GetAllCompanyCouponForSomeProducts, GetOneCompanyCouponForSomeProducts } = require('../../controller/discounts/companyCouponSomeProducts/get');
const { getQueryArgs } = require('../../lib/Functions');


router.get('/GetAllFestivalProducts', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        cityIds: 'string'
    })

    const { status, message, products, allProductsCount } = await GetAllFestivalProducts(args, null);

    res.status(status).json({ message, products, allProductsCount });
})

router.get('/GetAllMyFestivalProducts', setUserInfo, async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })
    const userInfo = req?.userInfo

    const { status, message, products, allProductsCount } = await GetAllMyFestivalProducts(args, { userInfo });

    res.status(status).json({ message, products, allProductsCount });
})


router.get('/GetAllMajorShoppingProducts', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        cityIds: 'string'
    })

    const { status, message, products, allProductsCount } = await GetAllMajorShoppingProducts(args, null);

    res.status(status).json({ message, products, allProductsCount });
})

router.get('/GetMyAllMajorShoppingProducts', setUserInfo, async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })
    const userInfo = req?.userInfo

    const { status, message, products, allProductsCount } = await GetMyAllMajorShoppingProducts(args, { userInfo });

    res.status(status).json({ message, products, allProductsCount });
})


router.get('/GetAllCompanyCouponForSomeProducts', setUserInfo, async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })
    const userInfo = req?.userInfo

    const { status, message, products, allProductsCount } = await GetAllCompanyCouponForSomeProducts(args, { userInfo });

    res.status(status).json({ message, products, allProductsCount });
})

router.get('/GetAllMyCompanyCouponForSomeProducts', setUserInfo, async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })
    const userInfo = req?.userInfo

    const { status, message, products, allProductsCount } = await GetAllMyCompanyCouponForSomeProducts(args, { userInfo });

    res.status(status).json({ message, products, allProductsCount });
})

router.get('/GetOneCompanyCouponForSomeProducts', setUserInfo, async (req, res) => {
    const args = getQueryArgs(req.query, { id: 'string' })
    const userInfo = req?.userInfo

    const { status, message, products } = await GetOneCompanyCouponForSomeProducts(args, { userInfo });

    res.status(status).json({ message, products });
})



module.exports = router;