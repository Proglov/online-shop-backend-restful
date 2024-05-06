const express = require('express');

const router = express.Router();

const {
    getMe,
    getUsers,
    isUserAdmin,
    getUsersCount
} = require('../../controller/users/get');


// get

router.get('/getMe', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, user, error } = await getMe(null, { userInfo })

    res.status(status).send({ user, error });
})


router.get('/getUsers', async (req, res) => {
    const userInfo = req?.userInfo

    const args = req.query

    const { status, users, error } = await getUsers(args, { userInfo })

    res.status(status).send({ users, error });
})


router.get('/isUserAdmin', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, isAdmin, error } = await isUserAdmin(null, { userInfo })

    res.status(status).send({ isAdmin, error });
})


router.get('/getUsersCount', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, usersCount, error } = await getUsersCount(null, { userInfo })

    res.status(status).send({ usersCount, error });
})



module.exports = router;