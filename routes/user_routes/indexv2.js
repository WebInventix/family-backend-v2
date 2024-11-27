const express = require("express");
//controller call 
const family = require('../../controllers/userv2/index')
const router = express.Router();

router.post('/add-coparent', family.addCP);
router.get('/get-cp', family.getCp)

module.exports = router;
