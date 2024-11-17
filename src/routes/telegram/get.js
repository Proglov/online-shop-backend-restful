const express = require('express');

const {
    GetCodeForTelegram,
    CheckTelegramStatus,
    GetTimeLeft
} = require('../../controller/telegram/get');


const router = express.Router();

router.get('/GetCodeForTelegram', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, message, code } = await GetCodeForTelegram(null, { userInfo });

    res.status(status).json({ message, code });
})

router.get('/CheckTelegramStatus', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, message, isLogged } = await CheckTelegramStatus(null, { userInfo });

    res.status(status).json({ message, isLogged });
})

router.get('/GetTimeLeft', async (req, res) => {
    const userInfo = req?.userInfo

    const { status, message, timeLeft } = await GetTimeLeft(null, { userInfo });

    res.status(status).json({ message, timeLeft });
})



module.exports = router;