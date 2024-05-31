const express = require('express');
const multer = require('multer');

const {
    updateImage
} = require('../../controller/image/update');

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage })



router.post('/updateImage', upload.single('images'), async (req, res) => {

    try {

        const args = {
            buffer: req.file?.buffer,
            filename: req.body.filename
        }

        const { status, message, name } = await updateImage({ ...args }, null);

        res.status(status).send({ message, name });
    } catch (error) {
        res.status(500).send({ message: error, name: null });
    }

})


module.exports = router;