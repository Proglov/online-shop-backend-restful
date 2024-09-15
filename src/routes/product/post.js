const express = require('express');

const router = express.Router();

const {
    ProductCreate
} = require('../../controller/products/post');


router.post('/ProductCreate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, product } = await ProductCreate({ ...input }, { userInfo });

    res.status(status).json({ message, product });
})




module.exports = router;