const express = require('express');

const {
    CheckCodeForTelegram,
    logoutFromTelegram
} = require('../../controller/telegram/post');


const router = express.Router();

router.post('/CheckCodeForTelegram', async (req, res) => {
    const { input } = req.body

    const { status, message } = await CheckCodeForTelegram({ ...input }, null);

    res.status(status).json({ message });
})

router.post('/logoutFromTelegram', async (req, res) => {
    const { input } = req.body

    const { status, message } = await logoutFromTelegram({ ...input }, null);

    res.status(status).json({ message });
})



module.exports = router;