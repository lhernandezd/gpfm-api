const router = require('express').Router({
  mergeParams: true,
});

const { authJwt } = require('../middlewares');
const controller = require('../controllers/patientCtrl');

router.param('id', controller.id);

router
  .route('/')
  .get(authJwt.verifyToken, authJwt.isUserOrAdmin, controller.all)
  .post(
    authJwt.verifyToken,
    authJwt.isUserOrAdmin,
    controller.create,
  );

router
  .route('/:id')
  .get(authJwt.verifyToken, authJwt.isUserOrAdmin, controller.read)
  .put(authJwt.verifyToken, authJwt.isUserOrAdmin, controller.update)
  .delete(authJwt.verifyToken, authJwt.isAdmin, controller.delete);

module.exports = router;
