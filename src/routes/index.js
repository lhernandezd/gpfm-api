const router = require('express').Router();

const auth = require('./auth');
const users = require('./user');
const patients = require('./patient');

router.use('/auth', auth);
router.use('/users', users);
router.use('/patients', patients);

module.exports = router;
