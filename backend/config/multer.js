const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = path.join(__dirname, "../public/images");

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    },
})

const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png/;

    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        return cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 }, //10MB ()
}).single("image");


module.exports = upload;