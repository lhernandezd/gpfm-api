const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'settings',
    [
      {
        id: uuidv4(),
        history_template: 'A',
        address: 'Carrera 44 No. 72 - 131 Consultorio 308 Clínica de Diagnostico',
        phone_number: '300 8469579',
        email: 'mariolly1998@gmail.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('settings', null, {}),
};
