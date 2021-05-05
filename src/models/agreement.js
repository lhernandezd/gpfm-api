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
            throw new Error('Please use a valid code');
          }
        },
      },
    },
  }, {});
  Agreement.associate = function (models) {
    Agreement.hasMany(models.patient, {
      foreignKey: 'agreement_id',
      onDelete: 'CASCADE',
    });
    Agreement.belongsTo(models.entity, {
      foreignKey: 'entity_id',
      onDelete: 'CASCADE',
    });
    Agreement.hasMany(models.history, {
      foreignKey: 'agreement_id',
      onDelete: 'CASCADE',
    });
  };
  return Agreement;
};
