const express = require('express');

const router = express.Router();

const {
    CityCreate
} = require('../../controller/city/post');


router.post('/CityCreate', async (req, res) => {
    const userInfo = req?.userInfo

    const { input } = req.body

    const { status, message, city } = await CityCreate({ ...input }, { userInfo });

    res.status(status).json({ message, city });
})

router.post('/set-cityIds', (req, res) => {
    const { ids } = req.body;

    if (Array.isArray(ids)) {
        // Set a cookie with the key "cityIds" and value as the JSON string of the array
        res.cookie('cityIds', JSON.stringify(ids), {
            httpOnly: false,
            maxAge: 86400000,
            path: '/',
            secure: true,
            sameSite: 'None'
        });
        return res.status(200).send('Cookie has been set!');
    } else {
        return res.status(400).send('Invalid input. Please send an array.');
    }
});



module.exports = router;