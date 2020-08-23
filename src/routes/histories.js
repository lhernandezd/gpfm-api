const router = require('express').Router({
  mergeParams: true,
});

const { authJwt } = require('../middlewares');
const controller = require('../controllers/historyCtrl');

router.param('id', controller.id);

router
  .route('/')
  .get(authJwt.verifyToken, authJwt.isAdmin, controller.all)
  .post(
    authJwt.verifyToken,
    authJwt.isAdmin,
    controller.create,
  );

router
  .route('/:id')
  .get(authJwt.verifyToken, authJwt.isAdmin, controller.read)
  .put(authJwt.verifyToken, authJwt.isAdmin, controller.update)
  .delete(authJwt.verifyToken, authJwt.isAdmin, controller.delete);

module.exports = router;
