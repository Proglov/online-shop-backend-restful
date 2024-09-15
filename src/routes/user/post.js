const express = require('express');

const router = express.Router();

const {
    UserSignUp,
    UserSignInWithPhone,
    UserSignInWithEmailOrUsername
} = require('../../controller/users/post');


router.post('/UserSignUp', async (req, res) => {
    const { input } = req.body

    const { status, message, token } = await UserSignUp({ ...input }, null);

    res.status(status).json({ message, token });
})


router.post('/UserSignInWithPhone', async (req, res) => {
    const { phone, password } = req.body

    const { status, message, token } = await UserSignInWithPhone({ phone, password }, null)

    res.status(status).json({ message, token });
})


router.post('/UserSignInWithEmailOrUsername', async (req, res) => {
    const { emailOrUsername, password } = req.body

    const { status, message, token } = await UserSignInWithEmailOrUsername({ emailOrUsername, password }, null)

    res.status(status).json({ message, token });
})





module.exports = router;