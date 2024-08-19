const express = require('express');
const { setUserInfo } = require('../../lib/middlewares');

const router = express.Router();

const { GetAllFestivalProducts, GetAllMyFestivalProducts } = require('../../controller/festivals/festival/get');
const { GetAllMajorShoppingProducts, GetMyAllMajorShoppingProducts } = require('../../controller/festivals/majorShopping/get');
const { GetAllMyCompanyCouponForSomeProducts, GetAllCompanyCouponForSomeProducts } = require('../../controller/festivals/companyCouponSomeProducts/get');


router.get('/GetAllFestivalProducts', async (req, res) => {
    const args = req.query

    const { status, message, products, allProductsCount } = await GetAllFestivalProducts(args, null);

    res.status(status).send({ message, products, allProductsCount });
})

router.get('/GetAllMyFestivalProducts', setUserInfo, async (req, res) => {
    const args = req.query
    const userInfo = req?.userInfo

    const { status, message, products, allProductsCount } = await GetAllMyFestivalProducts(args, { userInfo });

    res.status(status).send({ message, products, allProductsCount });
})


router.get('/GetAllMajorShoppingProducts', async (req, res) => {
    const args = req.query

    const { status, message, products, allProductsCount } = await GetAllMajorShoppingProducts(args, null);

    res.status(status).send({ message, products, allProductsCount });
})

router.get('/GetMyAllMajorShoppingProducts', setUserInfo, async (req, res) => {
    const args = req.query
    const userInfo = req?.userInfo

    const { status, message, products, allProductsCount } = await GetMyAllMajorShoppingProducts(args, { userInfo });

    res.status(status).send({ message, products, allProductsCount });
})

router.get('/GetAllCompanyCouponForSomeProducts', setUserInfo, async (req, res) => {
    const args = req.query
    const userInfo = req?.userInfo

    const { status, message, products, allProductsCount } = await GetAllCompanyCouponForSomeProducts(args, { userInfo });

    res.status(status).send({ message, products, allProductsCount });
})


router.get('/GetAllMyCompanyCouponForSomeProducts', setUserInfo, async (req, res) => {
    const args = req.query
    const userInfo = req?.userInfo

    const { status, message, products, allProductsCount } = await GetAllMyCompanyCouponForSomeProducts(args, { userInfo });

    res.status(status).send({ message, products, allProductsCount });
})



module.exports = router;