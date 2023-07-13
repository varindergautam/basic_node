const express = require('express');
const authController = require('../../../app/controllers/api/v1/AuthController');
const router  = express.Router(); 

router.post('/login', authController.login); 
router.post('/register', authController.register); 
module.exports = router;
