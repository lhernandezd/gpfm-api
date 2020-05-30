
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('patients', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID,
    },
    document_type: {
      type: Sequelize.STRING,
    },
    document: {
      type: Sequelize.STRING,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    birth_date: {
      type: Sequelize.DATE,
    },
    sex: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    neighborhood: {
      type: Sequelize.STRING,
    },
    occupation: {
      type: Sequelize.STRING,
    },
    civil_status: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    blood_type: {
      type: Sequelize.STRING,
    },
    city_id: {
      type: Sequelize.UUID,
      references: {
        model: {
          tableName: 'cities',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('patients'),
};
