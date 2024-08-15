const express = require('express');

const router = express.Router();

const { GetAllFestivalProducts } = require('../../controller/festivals/festival/get');
const { GetAllMajorShoppingProducts } = require('../../controller/festivals/majorShopping/get');


router.get('/GetAllFestivalProducts', async (req, res) => {
    const args = req.query

    const { status, message, products, allProductsCount } = await GetAllFestivalProducts(args, null);

    res.status(status).send({ message, products, allProductsCount });
})


router.get('/GetAllMajorShoppingProducts', async (req, res) => {
    const args = req.query

    const { status, message, products, allProductsCount } = await GetAllMajorShoppingProducts(args, null);

    res.status(status).send({ message, products, allProductsCount });
})




module.exports = router;