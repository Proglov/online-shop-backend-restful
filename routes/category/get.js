const express = require('express');

const router = express.Router();

const {
    getAllCategories,
    getOneCategory
} = require('../../controller/category/get');


router.get('/getAllCategories', async (req, res) => {
    const args = req.query

    const { products, allProductsCount, status, message } = await getAllCategories({ ...args }, null)

    res.status(status).send({ products, allProductsCount, message });
})

router.get('/getOneCategory', async (req, res) => {
    const args = req.query

    const { product, status, message } = await getOneCategory({ ...args }, null)

    res.status(status).send({ product, message });
})



module.exports = router;