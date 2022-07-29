import util from 'util'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __basedir + '/public/images')
    },

    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

const uploadMiddleware = util.promisify(upload)

const validateImage = file => {
    const filetypes = ['jpg', 'png', 'webp', 'jpeg']
    const imgMessages = []

    const extension = file.mimetype.split('/').pop();

    if (!filetypes.includes(extension)) {
        let msg = 'This image file is not valid. The following file types are accepted: jpg, jpeg, png, webp' 
        imgMessages.push(msg)
    }

    if (file.size > 25000000) {
        let msg = 'This image file is too large. Please upload an image smaller than 25 MB.'
        imgMessages.push(msg)
    }
    return imgMessages
}

export { upload, validateImage, uploadMiddleware }