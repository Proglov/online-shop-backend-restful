const express = require('express');

const router = express.Router();

const {
    UserUpdate
} = require('../../controller/users/update');


router.get('/UserUpdate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, token } = await UserUpdate({ ...input }, { userInfo })

    res.status(status).send({ message, token });
})




module.exports = router;