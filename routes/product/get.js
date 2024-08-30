const express = require('express');

const router = express.Router();

const {
    getAllProducts,
    getAllMyProducts,
    getOneProduct,
    getOneProductParams,
    getAllProductsOfACategory,
    getAllProductsOfASubcategory,
    getSomeProducts
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

router.get('/getOneProductParams', async (req, res) => {
    const args = req.query

    const { params, status, message } = await getOneProductParams({ ...args }, null)

    res.status(status).send({ params, message });
})

router.get('/getSomeProducts', async (req, res) => {
    const args = req.query

    const { products, status, message } = await getSomeProducts(args, null)

    res.status(status).send({ products, message });
})

router.get('/getAllProductsOfACategory', async (req, res) => {
    const args = req.query

    const { products, status, message } = await getAllProductsOfACategory({ ...args }, null)

    res.status(status).send({ products, message });
})

router.get('/getAllProductsOfASubcategory', async (req, res) => {
    const args = req.query

    const { products, status, message } = await getAllProductsOfASubcategory({ ...args }, null)

    res.status(status).send({ products, message });
})


module.exports = router;