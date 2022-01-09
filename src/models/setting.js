const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('setting', {
    iid: DataTypes.INTEGER,
    history_template: DataTypes.STRING,
    address: DataTypes.STRING,
    phone_number: DataTypes.STRING,
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
  }, {});

  return Setting;
};
