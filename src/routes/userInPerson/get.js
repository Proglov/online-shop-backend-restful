const express = require('express');

const router = express.Router();

const {
    getAllUserInPersons,
    getAllMyUserInPersons
} = require('../../controller/userInPersons/get');



router.get('/getAllUserInPersons', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, users, message, usersCount } = await getAllUserInPersons(args, { userInfo })

    res.status(status).send({ users, message, usersCount });
})

router.get('/getAllMyUserInPersons', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, users, message, usersCount } = await getAllMyUserInPersons(args, { userInfo })

    res.status(status).send({ users, message, usersCount });
})




module.exports = router;