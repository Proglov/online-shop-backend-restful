const express = require('express');

const router = express.Router();

const {
    SellerUpdate,
    SellerValidate
} = require('../../controller/sellers/update');


router.patch('/SellerUpdate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, token } = await SellerUpdate({ ...input }, { userInfo })

    res.status(status).send({ message, token });
})

router.patch('/SellerValidate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message } = await SellerValidate({ ...input }, { userInfo })

    res.status(status).send({ message });
})




module.exports = router;