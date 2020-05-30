const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('city', {
    iid: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      validate: {
        isValidName(val) {
          if (!validator.isAlpha(val, 'es-ES')) {
            throw new Error('Please use a valid name');
          }
        },
      },
    },
  }, {});

  City.associate = function (models) {
    City.belongsTo(models.state, {
      foreignKey: 'state_id',
      onDelete: 'CASCADE',
    });
    City.hasMany(models.user, {
      foreignKey: 'city_id',
      onDelete: 'CASCADE',
    });
    City.hasMany(models.patient, {
      foreignKey: 'city_id',
      onDelete: 'CASCADE',
    });
  };
  return City;
};
