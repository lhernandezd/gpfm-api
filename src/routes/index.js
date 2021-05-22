const router = require('express').Router();

const auth = require('./auth');
const users = require('./users');
const patients = require('./patients');
const cities = require('./cities');
const histories = require('./histories');
const codes = require('./codes');
const entities = require('./entities');
const agreements = require('./agreements');
const pdf = require('./pdf');

router.use('/auth', auth);
router.use('/users', users);
router.use('/patients', patients);
router.use('/cities', cities);
router.use('/histories', histories);
router.use('/codes', codes);
router.use('/entities', entities);
router.use('/agreements', agreements);
router.use('/pdf', pdf);

module.exports = router;
