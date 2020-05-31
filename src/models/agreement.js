const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const Agreement = sequelize.define('agreement', {
    iid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    code: {
      type: DataTypes.STRING,
      validate: {
        isValidNumber(val) {
          if (!validator.isNumeric(val)) {
            throw new Error('Please use a valid email');
          }
        },
      },
    },
    nit: {
      type: DataTypes.STRING,
      validate: {
        isValidNumber(val) {
          if (!validator.isNumeric(val)) {
            throw new Error('Please use a valid email');
          }
        },
      },
    },
    entity: DataTypes.STRING,
  }, {});
  Agreement.associate = function (models) {
    Agreement.belongsTo(models.patient, {
      foreignKey: 'patient_id',
      onDelete: 'CASCADE',
    });
  };
  return Agreement;
};
