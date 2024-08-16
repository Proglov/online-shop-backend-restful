const express = require('express');

const router = express.Router();

const { FestivalCreate } = require('../../controller/festivals/festival/post');
const { MajorShoppingCreate } = require('../../controller/festivals/majorShopping/post');
const { CompanyCouponForSomeProductsCreate, getTokenFromBodyCompanyCouponForSomeProducts } = require('../../controller/festivals/companyCouponSomeProducts/post');


router.post('/FestivalCreate', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message } = await FestivalCreate({ ...input }, { userInfo });

    res.status(status).send({ message });
})

router.post('/MajorShoppingCreate', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message } = await MajorShoppingCreate({ ...input }, { userInfo });

    res.status(status).send({ message });
})

router.post('/CompanyCouponForSomeProductsCreate', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message, body } = await CompanyCouponForSomeProductsCreate({ ...input }, { userInfo });

    res.status(status).send({ message, body });
})

router.post('/getTokenFromBodyCompanyCouponForSomeProducts', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message, token } = await getTokenFromBodyCompanyCouponForSomeProducts({ ...input }, { userInfo });

    res.status(status).send({ message, token });
})




module.exports = router;