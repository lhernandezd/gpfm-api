module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
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
    status: {
      type: Sequelize.STRING,
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
    address: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    reset_password_token: {
      type: Sequelize.STRING,
    },
    reset_password_expires: {
      type: Sequelize.DATE,
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
    created_by_id: {
      type: Sequelize.UUID,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
    },
    updated_by_id: {
      type: Sequelize.UUID,
      references: {
        model: {
          tableName: 'users',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('users'),
};
