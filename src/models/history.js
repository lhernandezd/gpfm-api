
module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('history', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    iid: DataTypes.INTEGER,
    weight: DataTypes.DECIMAL(10, 2),
    height: DataTypes.DECIMAL(10, 2),
    imc: DataTypes.DECIMAL(10, 2),
    heart_rate: DataTypes.DECIMAL(10, 2),
    blood_pressure: DataTypes.DECIMAL(10, 2),
    breath_frequency: DataTypes.DECIMAL(10, 2),
    temperature: DataTypes.DECIMAL(10, 2),
    cause: DataTypes.STRING,
    medical_evolution: DataTypes.TEXT,
    background: DataTypes.TEXT,
    medicine: DataTypes.TEXT,
    exam_performed: DataTypes.TEXT,
    reason: DataTypes.TEXT,
    physical_exam: DataTypes.TEXT,
    treatment_plan: DataTypes.TEXT,
    medical_formula: DataTypes.TEXT,
    note: DataTypes.STRING,
    consent: DataTypes.TEXT,
    current_illness: DataTypes.TEXT,
    current_treatment: DataTypes.TEXT,
  }, {});
  History.associate = function (models) {
    History.belongsTo(models.patient, {
      foreignKey: 'patient_id',
      onDelete: 'CASCADE',
    });
    History.belongsToMany(models.code, {
      through: 'history_codes',
      foreignKey: 'history_id',
      otherKey: 'code_id',
    });
  };
  return History;
};
