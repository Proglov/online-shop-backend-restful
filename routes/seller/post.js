const express = require('express');

const router = express.Router();

const {
    SellerSignUp,
    SellerSignInWithPhone,
    SellerSignInWithEmailOrUsername
} = require('../../controller/sellers/post');


router.post('/SellerSignUp', async (req, res) => {
    const { input } = req.body

    const { status, message, token } = await SellerSignUp({ ...input }, null);

    res.status(status).send({ message, token });
})


router.post('/SellerSignInWithPhone', async (req, res) => {
    const { phone } = req.body

    const { status, message, token } = await SellerSignInWithPhone({ phone }, null)

    res.status(status).send({ message, token });
})


router.post('/SellerSignInWithEmailOrUsername', async (req, res) => {
    const { emailOrUsername, password } = req.body

    const { status, message, token } = await SellerSignInWithEmailOrUsername({ emailOrUsername, password }, null)

    res.status(status).send({ message, token });
})





module.exports = router;