const express = require('express');

const router = express.Router();

const {
    ProductDelete
} = require('../../controller/products/delete');


router.delete('/ProductDelete', async (req, res) => {
    const userInfo = req?.userInfo
    const { id } = req.body

    const { status, message } = await ProductDelete({ id }, { userInfo });

    res.status(status).send({ message });
})




module.exports = router;