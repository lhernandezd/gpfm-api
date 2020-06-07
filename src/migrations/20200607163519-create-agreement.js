
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('agreements', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
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
    nit: {
      type: Sequelize.STRING,
    },
    entity: {
      type: Sequelize.STRING,
    },
    patient_id: {
      type: Sequelize.UUID,
      references: {
        model: {
          tableName: 'patients',
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
