const express = require('express');

const router = express.Router();

const {
    getAllProducts,
    getAllMyProducts,
    getOneProduct
} = require('../../controller/products/get');

const { setUserInfo } = require('../../lib/middlewares');

router.get('/getAllProducts', async (req, res) => {
    const args = req.query

    const { products, allProductsCount, status, message } = await getAllProducts({ ...args }, null)

    res.status(status).send({ products, allProductsCount, message });
})

router.get('/getAllMyProducts', setUserInfo, async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { products, allProductsCount, status, message } = await getAllMyProducts({ ...args }, { userInfo })

    res.status(status).send({ products, allProductsCount, message });
})

router.get('/getOneProduct', async (req, res) => {
    const args = req.query

    const { product, status, message } = await getOneProduct({ ...args }, null)

    res.status(status).send({ product, message });
})



module.exports = router;