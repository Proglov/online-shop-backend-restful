const express = require('express');

const router = express.Router();

const {
    ProductDelete
} = require('../../controller/products/delete');


router.delete('/ProductDelete', async (req, res) => {
    const userInfo = req?.userInfo
    const { id } = req.body

    const { status, message, _id } = await ProductDelete({ id }, { userInfo });

    res.status(status).send({ message, _id });
})




module.exports = router;