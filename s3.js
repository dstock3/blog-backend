import S3 from 'aws-sdk/clients/s3.js';
import 'dotenv/config';
import fs from 'fs'

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

//uploads a file to S3

const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    console.log("uploadFile: " + uploadParams)

    return s3.upload(uploadParams).promise()
}

// downloads a file from S3

const getFileStream = (fileKey) => {
    
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    console.log("get file stream: " + downloadParams)

    return s3.getObject(downloadParams).createReadStream()

}

export { uploadFile, getFileStream }
  