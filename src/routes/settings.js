const router = require('express').Router({
  mergeParams: true,
});

const { authJwt } = require('../middlewares');
const controller = require('../controllers/settingCtrl');

router
  .route('/')
  .get(authJwt.verifyToken, authJwt.isUserOrAdmin, controller.all);

router
  .route('/:id')
  .get(authJwt.verifyToken, authJwt.isUserOrAdmin, controller.read);

module.exports = router;
