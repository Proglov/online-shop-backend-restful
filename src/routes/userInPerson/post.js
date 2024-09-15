const express = require('express');

const router = express.Router();

const {
    UserInPersonCreate
} = require('../../controller/userInPersons/post');


router.post('/UserInPersonCreate', async (req, res) => {
    const { input } = req.body
    const userInfo = req?.userInfo

    const { status, message, user } = await UserInPersonCreate({ ...input }, { userInfo });

    res.status(status).json({ message, user });
})


module.exports = router;