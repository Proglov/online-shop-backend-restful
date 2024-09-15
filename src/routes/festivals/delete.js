const express = require('express');

const router = express.Router();

const { DeleteOneFestival } = require('../../controller/festivals/festival/delete');
const { DeleteOneMajorShopping } = require('../../controller/festivals/majorShopping/delete');
const { DeleteOneCompanyCouponForSomeProducts } = require('../../controller/festivals/companyCouponSomeProducts/delete');


router.delete('/DeleteOneFestival', async (req, res) => {
    const userInfo = req?.userInfo
    const args = req.query

    const { status, message } = await DeleteOneFestival(args, { userInfo });

    res.status(status).send({ message });
})


router.delete('/DeleteOneMajorShopping', async (req, res) => {
    const userInfo = req?.userInfo
    const args = req.query

    const { status, message } = await DeleteOneMajorShopping(args, { userInfo });

    res.status(status).send({ message });
})

router.delete('/DeleteOneCompanyCouponForSomeProducts', async (req, res) => {
    const userInfo = req?.userInfo
    const args = req.query

    const { status, message } = await DeleteOneCompanyCouponForSomeProducts(args, { userInfo });

    res.status(status).send({ message });
})




module.exports = router;