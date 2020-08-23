const router = require('express').Router();

const auth = require('./auth');
const users = require('./user');
const patients = require('./patient');
const cities = require('./cities');
const histories = require('./histories');
const codes = require('./codes');

router.use('/auth', auth);
router.use('/users', users);
router.use('/patients', patients);
router.use('/cities', cities);
router.use('/histories', histories);
router.use('/codes', codes);

module.exports = router;
