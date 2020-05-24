const router = require('express').Router({
  mergeParams: true,
});

const { authJwt } = require('../middlewares');
const controller = require('../controllers/userCtrl');

router.param('id', controller.id);

router
  .route('/')
  .get(authJwt.verifyToken, authJwt.isAdmin, controller.all);

router
  .route('/:id')
  .get(authJwt.verifyToken, authJwt.isAdmin, controller.read)
  .delete(authJwt.verifyToken, authJwt.isAdmin, controller.delete);

module.exports = router;
