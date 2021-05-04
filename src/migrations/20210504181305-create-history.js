
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('histories', {
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
    weight: {
      type: Sequelize.DECIMAL(10, 2),
    },
    height: {
      type: Sequelize.DECIMAL(10, 2),
    },
    imc: {
      type: Sequelize.DECIMAL(10, 2),
    },
    heart_rate: {
      type: Sequelize.DECIMAL(10, 2),
    },
    blood_pressure: {
      type: Sequelize.DECIMAL(10, 2),
    },
    breath_frequency: {
      type: Sequelize.DECIMAL(10, 2),
    },
    temperature: {
      type: Sequelize.DECIMAL(10, 2),
    },
    cause: {
      type: Sequelize.STRING,
    },
    medical_evolution: {
      type: Sequelize.TEXT,
    },
    background: {
      type: Sequelize.TEXT,
    },
    medicine: {
      type: Sequelize.TEXT,
    },
    exam_performed: {
      type: Sequelize.TEXT,
    },
    reason: {
      type: Sequelize.TEXT,
    },
    physical_exam: {
      type: Sequelize.TEXT,
    },
    treatment_plan: {
      type: Sequelize.TEXT,
    },
    medical_formula: {
      type: Sequelize.TEXT,
    },
    note: {
      type: Sequelize.STRING,
    },
    consent: {
      type: Sequelize.TEXT,
    },
    current_illness: {
      type: Sequelize.TEXT,
    },
    current_treatment: {
      type: Sequelize.TEXT,
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
    agreement_id: {
      type: Sequelize.UUID,
      references: {
        model: {
          tableName: 'agreements',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('histories'),
};
