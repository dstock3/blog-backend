import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/images')
    },

    filename: (req, file, cb) => {
        cb(null,  file.originalname)
    }
})
  
const upload = multer({ 
    storage: storage
})

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