const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    iid: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      validate: {
        isValidType(val) {
          const type = ['active', 'inactive'].find((item) => item === val);
          if (!type) {
            throw new Error('Please use a valid status');
          }
        },
      },
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    full_name: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.first_name} ${this.last_name}`;
      },
      set() {
        throw new Error('Do not try to set the `fullName` value!');
      },
    },
    phone_number: DataTypes.STRING,
    address: DataTypes.STRING,
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
    created_by_id: DataTypes.UUID,
    updated_by_id: DataTypes.UUID,
    reset_password_token: DataTypes.STRING,
    reset_password_expires: DataTypes.DATE,
  }, {});

  User.associate = function (models) {
    User.belongsToMany(models.role, {
      through: 'user_roles',
      foreignKey: 'user_id',
      otherKey: 'role_id',
    });

    User.belongsTo(models.city, {
      foreignKey: 'city_id',
      onDelete: 'CASCADE',
    });
  };

  return User;
};
