module.exports = (sequelize, DataTypes) => {
  const Code = sequelize.define('code', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    iid: DataTypes.INTEGER,
    code: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {});

  Code.associate = function (models) {
    Code.belongsToMany(models.history, {
      through: 'history_codes',
      foreignKey: 'code_id',
      otherKey: 'history_id',
    });
  };

  return Code;
};
