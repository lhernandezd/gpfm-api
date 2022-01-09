
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('histories', 'template', {
      type: Sequelize.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('histories');
  },
};
