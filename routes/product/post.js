const express = require('express');

const router = express.Router();

const {
    ProductCreate
} = require('../../controller/products/post');


router.post('/ProductCreate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message } = await ProductCreate({ ...input }, { userInfo });

    res.status(status).send({ message });
})




module.exports = router;