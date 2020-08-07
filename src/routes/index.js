const router = require('express').Router();

const auth = require('./auth');
const users = require('./user');
const patients = require('./patient');
const cities = require('./cities');

router.use('/auth', auth);
router.use('/users', users);
router.use('/patients', patients);
router.use('/cities', cities);

module.exports = router;
