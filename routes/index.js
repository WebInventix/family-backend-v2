const express = require('express');
const router = express.Router()

const public_routes = require('./public_routes/index')
const user_routes = require('./user_routes/index');
const common_routes = require('./common_routes/index');
const version3 = require('./user_routes/indexv2')
const check_user_auth = require('../middlewares/check_user_auth');



router.use('/', public_routes)

router.use(check_user_auth)

router.use('/', common_routes)
router.use('/user', user_routes)
router.use('/v3', version3)





module.exports = router