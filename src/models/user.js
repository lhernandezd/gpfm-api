const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isValidEmail(val) {
          if (!validator.isEmail(val)) {
            throw new Error('Please use a valid email');
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        isLongEnough(val) {
          if (val.length < 6) {
            throw new Error('Please choose a longer password');
          }
        },
      },
    },
    reset_password_token: DataTypes.STRING,
    reset_password_expires: DataTypes.DATE,
  }, {});

  User.associate = function (models) {
    User.belongsToMany(models.role, {
      through: 'user_roles',
      foreignKey: 'user_id',
      otherKey: 'role_id',
    });
  };

  return User;
};
