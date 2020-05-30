const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('contact', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
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
    occupation: DataTypes.STRING,
  }, {});
  Contact.associate = function (models) {
    Contact.belongsTo(models.patient, {
      foreignKey: 'patient_id',
      onDelete: 'CASCADE',
    });
  };
  return Contact;
};
