const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const s3 = new S3Client({
    region: "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY
    },
});


const getImage = async (args, _context) => {
    const { filename } = args

    try {

        const params = {
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: filename,
        };

        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command);
        return {
            url,
            message: "success full",
            status: 200
        }

    } catch (error) {
        return {
            url: null,
            message: error,
            status: 500
        }
    }
}


const getImages = async (args, _context) => {
    const { filenames } = args

    try {
        let urls = [];

        for (let filename of filenames) {
            const params = {
                Bucket: process.env.LIARA_BUCKET_NAME,
                Key: filename,
            };

            const command = new GetObjectCommand(params);
            const url = await getSignedUrl(s3, command);
            urls.push(url)
        }
        return {
            urls,
            message: "success full",
            status: 200
        }


    } catch (error) {
        return {
            urls: null,
            message: error,
            status: 500
        }
    }
}



module.exports = {
    getImage,
    getImages,
};