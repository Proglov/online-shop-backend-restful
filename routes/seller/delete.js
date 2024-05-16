const express = require('express');

const router = express.Router();

const {
    SellerDelete
} = require('../../controller/sellers/delete');


router.delete('/SellerDelete', async (req, res) => {
    const userInfo = req?.userInfo
    const { id } = req.body

    const { status, message } = await SellerDelete({ id }, { userInfo });

    res.status(status).send({ message });
})




module.exports = router;