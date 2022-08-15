import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../images/'))
    },

    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

const validateImage = file => {
    const filetypes = ['jpg', 'png', 'webp', 'jpeg', 'svg']
    const imgMessages = []

    const ext = file.mimetype.split('/').pop();

    if (!filetypes.includes(ext)) {
        let msg = 'This image file is not valid. The following file types are accepted: jpg, jpeg, png, webp, and svg' 
        imgMessages.push(msg)
    }

    if (file.size > 25000000) {
        let msg = 'This image file is too large. Please upload an image smaller than 25 MB.'
        imgMessages.push(msg)
    }
    return imgMessages
}

export { upload, validateImage  }