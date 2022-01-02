const router = require('express').Router({
  mergeParams: true,
});

const { verifySignUp, authJwt } = require('../middlewares');
const controller = require('../controllers/authCtrl');

router
  .route('/signup')
  .post(
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
    controller.signup,
  );

router
  .route('/signin')
  .post(controller.signin);

router
  .route('/signintoken')
  .post(authJwt.verifyToken, controller.signintoken);

router
  .route('/recover')
  .post(controller.recover);

router
  .route('/reset/:token')
  .post(controller.reset);

module.exports = router;
