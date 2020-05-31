module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('role', {
    iid: DataTypes.INTEGER,
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: DataTypes.STRING,
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
