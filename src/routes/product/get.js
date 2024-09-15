const express = require('express');
const {
    getAllProducts,
    getAllMyProducts,
    getAllProductsOfASeller,
    getOneProduct,
    getOneProductParams,
    getAllProductsOfACategory,
    getAllProductsOfASubcategory,
    getSomeProducts
} = require('../../controller/products/get');

const { setUserInfo } = require('../../lib/middlewares');
const { getQueryArgs } = require('../../lib/Functions');

const router = express.Router();


router.get('/getAllProducts', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { products, allProductsCount, status, message } = await getAllProducts(args, null)

    res.status(status).json({ products, allProductsCount, message });
})


router.get('/getAllMyProducts', setUserInfo, async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { products, allProductsCount, status, message } = await getAllMyProducts(args, { userInfo })

    res.status(status).json({ products, allProductsCount, message });
})

router.get('/getAllProductsOfASeller', setUserInfo, async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        id: 'string'
    })

    const { products, allProductsCount, status, message } = await getAllProductsOfASeller(args, { userInfo })

    res.status(status).json({ products, allProductsCount, message });
})

router.get('/getOneProduct', async (req, res) => {
    const args = getQueryArgs(req.query, { id: 'string' })

    const { product, status, message } = await getOneProduct(args, null)

    res.status(status).json({ product, message });
})

router.get('/getOneProductParams', async (req, res) => {
    const args = getQueryArgs(req.query, { id: 'string' })

    const { params, status, message } = await getOneProductParams(args, null)

    res.status(status).json({ params, message });
})

router.get('/getSomeProducts', async (req, res) => {
    // i didn't use getQueryArgs for this one, but i used encodeURIComponent inside its controller
    const args = req.query

    const { products, status, message } = await getSomeProducts(args, null)

    res.status(status).json({ products, message });
})

router.get('/getAllProductsOfACategory', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        categoryId: 'string'
    })

    const { products, status, message } = await getAllProductsOfACategory(args, null)

    res.status(status).json({ products, message });
})

router.get('/getAllProductsOfASubcategory', async (req, res) => {
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt',
        subcategoryId: 'string'
    })

    const { products, status, message } = await getAllProductsOfASubcategory(args, null)

    res.status(status).json({ products, message });
})


module.exports = router;