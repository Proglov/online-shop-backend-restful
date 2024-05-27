const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage })

const s3 = new S3Client({
    region: "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY
    },
});


router.post('/uploadImages', upload.single('images'), async (req, res) => {

    try {
        const date = new Date();
        const now = date.getTime();
        const params = {
            Body: req.file.buffer,
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: now + "_" + req.file.originalname,
            ContentType: req.file.mimetype
        };
        await s3.send(new PutObjectCommand(params));
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;