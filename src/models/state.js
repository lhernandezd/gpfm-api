const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('state', {
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
    code: DataTypes.STRING,
  }, {});

  State.associate = function (models) {
    State.hasMany(models.city, {
      foreignKey: 'state_id',
      onDelete: 'CASCADE',
    });
  };
  return State;
};
