const express = require('express');

const {
    deleteImage,
    deleteImages
} = require('../../controller/image/delete');

const router = express.Router();


router.delete('/deleteImage', async (req, res) => {

    try {

        const args = {
            filename: req.body.filename
        }

        const { status, message } = await deleteImage({ ...args }, null);

        res.status(status).send({ message });
    } catch (error) {
        res.status(500).send({ message: error });
    }

})


router.delete('/deleteImages', async (req, res) => {

    try {

        const args = {
            filenames: req.body.filenames
        }

        const { status, message } = await deleteImages({ ...args }, null);

        res.status(status).send({ message });
    } catch (error) {
        res.status(500).send({ message: error });
    }

})


module.exports = router;