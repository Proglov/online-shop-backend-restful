const express = require('express');

const {
    getImage
} = require('../../controller/image/get');


const router = express.Router();

router.get('/getImage', async (req, res) => {

    try {
        const { filename } = req.body


        const { status, url, message } = await getImage({ ...filename }, null)

        res.status(status).json({ url, message });

    } catch (error) {
        res.status(500).json({ url: null, message: error });
    }
})


module.exports = router;