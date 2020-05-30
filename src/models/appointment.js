
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('appointment', {
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    status: {
      type: DataTypes.STRING,
      validate: {
        isValidType(val) {
          const type = ['active', 'completed', 'canceled'].find((item) => item === val);
          if (!type) {
            throw new Error('Please use a valid status');
          }
        },
      },
    },
    description: DataTypes.STRING,
  }, {});
  Appointment.associate = function (models) {
    Appointment.belongsTo(models.patient, {
      foreignKey: 'patient_id',
      onDelete: 'CASCADE',
    });
  };
  return Appointment;
};
