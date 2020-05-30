
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('appointment', {
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
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
