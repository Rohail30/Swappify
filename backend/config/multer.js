const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images")
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
        cb(new Error("Only jpeg, jpg & png files are allowed"), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 }, //10MB ()
}).single("image");


module.exports = upload;