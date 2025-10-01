const express = require('express');


const router = express.Router();
const privilligeController = require('../controllers/privilliges.controller');  



router.get('/', privilligeController.privilliges);         // Get all privilliges


module.exports = router;