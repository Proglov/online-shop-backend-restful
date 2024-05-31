const { S3Client, DeleteObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();


const s3 = new S3Client({
    region: "default",
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY
    },
});


const deleteImage = async (args, _context) => {
    const { filename } = args

    try {
        const params = {
            Bucket: process.env.LIARA_BUCKET_NAME,
            Key: filename,
        };
        await s3.send(new DeleteObjectCommand(params));
        return {
            status: 201,
            message: "Successfully Deleted"
        }
    } catch (error) {
        return {
            status: 500,
            message: error
        }
    }

}

const deleteImages = async (args, _context) => {
    const { filenames } = args

    try {
        const files2Delete = [];
        for (const filename of filenames) {
            files2Delete.push({
                "Key": filename
            })
        }
        const params = {
            "Bucket": process.env.LIARA_BUCKET_NAME,
            "Delete": {
                "Objects": files2Delete
            },
        };
        await s3.send(new DeleteObjectsCommand(params));
        return {
            status: 201,
            message: "Successfully Deleted"
        }
    } catch (error) {
        return {
            status: 500,
            message: error,
        }
    }

}


module.exports = {
    deleteImages,
    deleteImage
};