const express = require('express');

const router = express.Router();

const {
    getMe,
    getUsers,
    isUserAdmin
} = require('../../controller/users/get');


router.get('/getMe', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, user, message } = await getMe(null, { userInfo })

    res.status(status).send({ user, message });
})


router.get('/getUsers', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, users, message, usersCount } = await getUsers(args, { userInfo })

    res.status(status).send({ users, message, usersCount });
})


router.get('/isUserAdmin', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, isAdmin, message } = await isUserAdmin(null, { userInfo })

    res.status(status).send({ isAdmin, message });
})




module.exports = router;