const express = require('express');

const router = express.Router();

const {
    TransActionCreate
} = require('../../controller/transactions/post');


router.post('/TransActionCreate', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message } = await TransActionCreate({ ...input }, { userInfo });

    res.status(status).send({ message });
})


module.exports = router;