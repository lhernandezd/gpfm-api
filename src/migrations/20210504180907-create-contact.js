
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('contacts', {
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
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    occupation: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('contacts'),
};
