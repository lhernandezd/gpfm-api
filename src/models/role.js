module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('role', {
    name: DataTypes.STRING,
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  }, {});

  Role.associate = function (models) {
    Role.belongsToMany(models.user, {
      through: 'user_roles',
      foreignKey: 'role_id',
      otherKey: 'user_id',
    });
  };

  return Role;
};
