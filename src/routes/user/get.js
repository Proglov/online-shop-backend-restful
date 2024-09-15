const express = require('express');

const router = express.Router();

const {
    getMe,
    getUser,
    getUsers,
    isUserAdmin
} = require('../../controller/users/get');
const { getQueryArgs } = require('../../lib/Functions');


router.get('/getMe', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, user, message } = await getMe(null, { userInfo })

    res.status(status).json({ user, message });
})


router.get('/getUser', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, { id: 'string' })

    const { status, user, message } = await getUser(args, { userInfo })

    res.status(status).json({ user, message });
})


router.get('/getUsers', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { status, users, message, usersCount } = await getUsers(args, { userInfo })

    res.status(status).json({ users, message, usersCount });
})


router.get('/isUserAdmin', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, isAdmin, message } = await isUserAdmin(null, { userInfo })

    res.status(status).json({ isAdmin, message });
})




module.exports = router;