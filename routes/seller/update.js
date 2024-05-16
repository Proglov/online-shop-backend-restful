const express = require('express');

const router = express.Router();

const {
    SellerUpdate
} = require('../../controller/sellers/update');


router.patch('/SellerUpdate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, token } = await SellerUpdate({ ...input }, { userInfo })

    res.status(status).send({ message, token });
})




module.exports = router;