const router = require('express').Router();

const auth = require('./auth');
const users = require('./user');

router.use('/auth', auth);
router.use('/users', users);

module.exports = router;
