
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('agreements', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID,
    },
    iid: {
      allowNull: false,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.STRING,
    },
    entity_id: {
      type: Sequelize.UUID,
      references: {
        model: {
          tableName: 'entities',
        },
        key: 'id',
      },
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('agreements'),
};
