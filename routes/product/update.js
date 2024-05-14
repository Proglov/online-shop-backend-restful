const express = require('express');

const router = express.Router();

const {
    ProductUpdate
} = require('../../controller/products/update');


router.patch('/ProductUpdate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message } = await ProductUpdate({ ...input }, { userInfo })

    res.status(status).send({ message });
})




module.exports = router;