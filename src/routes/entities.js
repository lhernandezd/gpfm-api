const router = require('express').Router({
  mergeParams: true,
});

const { authJwt } = require('../middlewares');
const controller = require('../controllers/entityCtrl');

router.param('id', controller.id);

router
  .route('/')
  .get(authJwt.verifyToken, authJwt.isAdmin, controller.all)
  .post(
    authJwt.verifyToken,
    authJwt.isAdmin,
    controller.create,
  );

module.exports = router;
