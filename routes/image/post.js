const express = require('express');
const multer = require('multer');

const {
    uploadImage
} = require('../../controller/image/post');

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage })



router.post('/uploadImage', upload.single('images'), async (req, res) => {

    try {

        const args = {
            buffer: req.file?.buffer,
            mimetype: req.file?.mimetype
        }

        const { status, message, name } = await uploadImage({ ...args }, null);

        res.status(status).send({ message, name });
    } catch (error) {
        res.status(500).send({ message: error, name: null });
    }

})


module.exports = router;