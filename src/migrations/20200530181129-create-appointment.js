
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('appointments', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID,
    },
    start_date: {
      type: Sequelize.DATE,
    },
    end_date: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.STRING,
    },
    description: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('appointments'),
};
