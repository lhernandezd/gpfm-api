const { v4: uuidv4 } = require('uuid');
const jsonCodes = require('../src/jsonData/codesTest.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const codes = [];
    jsonCodes.forEach((item) => {
      codes.push(
        {
          id: uuidv4(),
          description: item.description,
          code: item.code,
          created_at: new Date(),
          updated_at: new Date(),
        },
      );
    });

    return queryInterface.bulkInsert('codes', codes);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('codes', null, {}),
};
