const dateObjFromISOString = require('./dates');

const eventData = (appointment, patient) => {
  const {
    year: startYear, month: startMonth, day: startDay, hour: startHour,
  } = dateObjFromISOString(appointment.start_date);
  const {
    year: endYear, month: endMonth, day: endDay, hour: endHour,
  } = dateObjFromISOString(appointment.end_date);

  const event = {
    start: [startYear, startMonth, startDay, startHour, 5],
    end: [endYear, endMonth, endDay, endHour, 5],
    title: appointment.title,
    description: appointment.description,
    location: 'Carrera 44 No. 72 - 131 Consultorio 308 Clínica de Diagnostico',
    geo: { lat: 10.992699903865882, lon: -74.80758433892237 },
    status: 'CONFIRMED',
    organizer: { name: 'Dra Mariolly', email: 'mariolly1998@gmail.com' },
    attendees: [
      {
        name: patient.fullName, email: patient.email, rsvp: true, partstat: 'NEED-ACTIONS', role: 'REQ-PARTICIPANT',
      },
    ],
    method: 'REQUEST',
  };

  return event;
};

module.exports = {
  eventData,
};
