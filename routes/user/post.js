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

    res.status(status).send({ message, token });
})


router.post('/UserSignInWithPhone', async (req, res) => {
    const { phone } = req.body

    const { status, message, token } = await UserSignInWithPhone({ phone }, null)

    res.status(status).send({ message, token });
})


router.post('/UserSignInWithEmailOrUsername', async (req, res) => {
    const { emailOrUsername, password } = req.body

    const { status, message, token } = await UserSignInWithEmailOrUsername({ emailOrUsername, password }, null)

    res.status(status).send({ message, token });
})





module.exports = router;