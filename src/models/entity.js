const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const Entity = sequelize.define('entity', {
    iid: DataTypes.INTEGER,
    name: DataTypes.STRING,
    nit: {
      type: DataTypes.STRING,
      validate: {
        isValidNumber(val) {
          if (!validator.isNumeric(val)) {
            throw new Error('Please use a valid nit');
          }
        },
      },
    },
  }, {});

  Entity.associate = function (models) {
    Entity.hasMany(models.agreement, {
      foreignKey: 'entity_id',
      onDelete: 'CASCADE',
    });
  };
  return Entity;
};
