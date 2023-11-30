const express = require('express');
const categoryController = require('../../../app/controllers/api/v1/CategoryController');
const router  = express.Router();
const checkAuthMiddleware = require('../../../helper/verifyToken');
const imageUploader = require('../../../helper/imageUploader');

router.get('/', checkAuthMiddleware.verifyToken, categoryController.list); 
router.post('/store', checkAuthMiddleware.verifyToken, imageUploader.upload.single('image') ,categoryController.store); 
module.exports = router;
