const router = require('express').Router({
  mergeParams: true,
});

const { verifySignUp } = require('../middlewares');
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

module.exports = router;
