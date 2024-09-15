const express = require('express');

const router = express.Router();

const { FestivalCreate } = require('../../controller/festivals/festival/post');
const { MajorShoppingCreate } = require('../../controller/festivals/majorShopping/post');
const { CompanyCouponForSomeProductsCreate, getTokenFromBodyCompanyCouponForSomeProducts } = require('../../controller/festivals/companyCouponSomeProducts/post');


router.post('/FestivalCreate', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message, festival } = await FestivalCreate({ ...input }, { userInfo });

    res.status(status).send({ message, festival });
})

router.post('/MajorShoppingCreate', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message, majorShopping } = await MajorShoppingCreate({ ...input }, { userInfo });

    res.status(status).send({ message, majorShopping });
})

router.post('/CompanyCouponForSomeProductsCreate', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message, coupon } = await CompanyCouponForSomeProductsCreate({ ...input }, { userInfo });

    res.status(status).send({ message, coupon });
})

router.post('/getTokenFromBodyCompanyCouponForSomeProducts', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message, token, productsIds, maxOffPrice, minBuy, offPercentage } = await getTokenFromBodyCompanyCouponForSomeProducts({ ...input }, { userInfo });

    res.status(status).send({ message, token, productsIds, maxOffPrice, minBuy, offPercentage });
})




module.exports = router;