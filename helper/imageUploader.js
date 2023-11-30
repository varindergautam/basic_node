const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        // console.log(file.mimeType + ' file.mimeType');
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});

// Image validation function
function imageFilter(req, file, cb) {
    // Check if the uploaded file is an image
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Reject the file if it's not an image
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'));
    }
  }


const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024*1024*10
    },
  fileFilter: imageFilter, // Add the image validation function here

});

module.exports = {
    upload : upload
}