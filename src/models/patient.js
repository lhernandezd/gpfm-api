const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('patient', {
    iid: DataTypes.INTEGER,
    document_type: {
      type: DataTypes.STRING,
      validate: {
        isValidType(val) {
          const type = ['cc', 'ti', 'pa'].find((item) => item === val);
          if (!type) {
            throw new Error('Please use a valid document type');
          }
        },
      },
    },
    document: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    gender: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isValidEmail(val) {
          if (!validator.isEmail(val)) {
            throw new Error('Please use a valid email');
          }
        },
      },
    },
    neighborhood: DataTypes.STRING,
    occupation: DataTypes.STRING,
    civil_status: {
      type: DataTypes.STRING,
      validate: {
        isValidType(val) {
          const type = ['single', 'married'].find((item) => item === val);
          if (!type) {
            throw new Error('Please use a valid civil status');
          }
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isValidType(val) {
          const type = ['active', 'inactive'].find((item) => item === val);
          if (!type) {
            throw new Error('Please use a valid status');
          }
        },
      },
    },
    blood_type: {
      type: DataTypes.STRING,
      validate: {
        isValidType(val) {
          const type = ['o-', 'o+', 'a-', 'a+', 'b-', 'b+', 'ab-', 'ab+'].find((item) => item === val);
          if (!type) {
            throw new Error('Please use a valid blood type');
          }
        },
      },
    },
    created_by_id: DataTypes.UUID,
    updated_by_id: DataTypes.UUID,
  }, {});

  Patient.associate = function (models) {
    Patient.belongsTo(models.city, {
      foreignKey: 'city_id',
      onDelete: 'CASCADE',
    });
    Patient.hasMany(models.contact, {
      foreignKey: 'patient_id',
      onDelete: 'CASCADE',
    });
    Patient.hasMany(models.appointment, {
      foreignKey: 'patient_id',
      onDelete: 'CASCADE',
    });
    Patient.hasMany(models.history, {
      foreignKey: 'patient_id',
      onDelete: 'CASCADE',
    });
    Patient.belongsTo(models.agreement, {
      foreignKey: 'agreement_id',
      onDelete: 'CASCADE',
    });
  };
  return Patient;
};
