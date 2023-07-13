const express = require('express');
const userController = require('../../../app/controllers/api/v1/UserController');
const router  = express.Router(); 

router.get('/', userController.userList); 
module.exports = router;