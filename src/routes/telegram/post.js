const express = require('express');

const {
    CheckCodeForTelegram,
    logoutFromTelegram,
    CheckTelegramStatusFromBot
} = require('../../controller/telegram/post');


const router = express.Router();

router.post('/CheckCodeForTelegram', async (req, res) => {
    const { input } = req.body

    const { status, message, storeName } = await CheckCodeForTelegram({ ...input }, null);

    res.status(status).json({ message, storeName });
})

router.post('/logoutFromTelegram', async (req, res) => {
    const { input } = req.body

    const { status, message } = await logoutFromTelegram({ ...input }, null);

    res.status(status).json({ message });
})

router.post('/CheckTelegramStatusFromBot', async (req, res) => {
    const { input } = req.body

    const { status, message, storeName } = await CheckTelegramStatusFromBot({ ...input }, null);

    res.status(status).json({ message, storeName });
})



module.exports = router;