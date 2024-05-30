const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();


const crypto = require('crypto');
const sharp = require('sharp');

const s3 = new S3Client({
    region: "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY
    },
});


const uploadImages = async (args, _context) => {
    const { buffer, mimetype } = args

    try {
        // resize
        const newBuffer = await sharp(buffer).resize({ height: 1920, width: 1080, fit: "contain" }).toBuffer()
        //name
        const date = new Date();
        const now = date.getTime();
        const imageName = now + "_" + crypto.randomBytes(32).toString('hex');
        const params = {
            Body: newBuffer,
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: imageName,
            ContentType: mimetype
        };
        await s3.send(new PutObjectCommand(params));
        return {
            status: 201,
            message: "Successfully Added",
            name: imageName
        }
    } catch (error) {
        return {
            status: 500,
            message: error,
            name: null
        }
    }

}


module.exports = {
    uploadImages
};