const router = require('express').Router({
  mergeParams: true,
});

const { authJwt } = require('../middlewares');
const controller = require('../controllers/cityCtrl');

router
  .route('/')
  .get(authJwt.verifyToken, authJwt.isAdmin, controller.all);

module.exports = router;
