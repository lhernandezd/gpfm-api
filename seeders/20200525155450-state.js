const { v4: uuidv4 } = require('uuid');
const models = require('../src/models');

const State = models.state;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      'states',
      [
        {
          id: uuidv4(),
          name: 'Atlantico',
          code: '08',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
    const state = await State.findOne({
      where: {
        name: 'Atlantico',
      },
    });

    await queryInterface.bulkInsert('cities', [{
      id: uuidv4(),
      state_id: state.id,
      name: 'Barranquilla',
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('states', null, {}),
};
