const router = require('express').Router({
  mergeParams: true,
});

const { authJwt } = require('../middlewares');
const controller = require('../controllers/codeCtrl');

router
  .route('/')
  .get(authJwt.verifyToken, authJwt.isAdmin, controller.all);

module.exports = router;
