const router = require('express').Router({
  mergeParams: true,
});

const { authJwt } = require('../middlewares');
const controller = require('../controllers/pdfCtrl');

router
  .route('/')
  .post(
    authJwt.verifyToken,
    authJwt.isUserOrAdmin,
    controller.create,
  );

module.exports = router;
