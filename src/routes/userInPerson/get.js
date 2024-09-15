const express = require('express');

const router = express.Router();

const {
    getAllUserInPersons,
    getAllMyUserInPersons
} = require('../../controller/userInPersons/get');



router.get('/getAllUserInPersons', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { status, users, message, usersCount } = await getAllUserInPersons(args, { userInfo })

    res.status(status).json({ users, message, usersCount });
})

router.get('/getAllMyUserInPersons', async (req, res) => {
    const userInfo = req?.userInfo
    const args = getQueryArgs(req.query, {
        page: 'posInt',
        perPage: 'posInt'
    })

    const { status, users, message, usersCount } = await getAllMyUserInPersons(args, { userInfo })

    res.status(status).json({ users, message, usersCount });
})




module.exports = router;