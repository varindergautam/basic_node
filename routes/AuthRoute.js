const express = require('express');
const authController = require('../app/controllers/AuthController');
const router  = express.Router(); 

router.get('/', authController.login); 
module.exports = router;
