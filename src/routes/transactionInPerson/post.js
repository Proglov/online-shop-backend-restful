const express = require('express');

const router = express.Router();

const {
    TransActionInPersonCreate
} = require('../../controller/transactionInPersons/post');


router.post('/TransActionInPersonCreate', async (req, res) => {
    const userInfo = req?.userInfo
    const { input } = req.body

    const { status, message, transaction } = await TransActionInPersonCreate({ ...input }, { userInfo });

    res.status(status).send({ message, transaction });
})


module.exports = router;