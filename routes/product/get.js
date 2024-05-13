const express = require('express');

const router = express.Router();

const {
    getAllProducts,
    getOneProduct
} = require('../../controller/products/get');


router.get('/getAllProducts', async (req, res) => {
    const args = req.query

    const { products, allProductsCount, status, error } = await getAllProducts({ ...args }, null)

    res.status(status).send({ products, allProductsCount, error });
})

router.get('/getOneProduct', async (req, res) => {
    const args = req.query

    const { product, status, error } = await getOneProduct({ ...args }, null)

    res.status(status).send({ product, error });
})



module.exports = router;