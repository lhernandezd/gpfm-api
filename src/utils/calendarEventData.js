const { dateObjFromISOString } = require('./dates');

const fromEmail = process.env.SENDGRID_EMAIL;

const eventData = (appointment, patient) => {
  const {
    year: startYear, month: startMonth, day: startDay, hour: startHour, minute: startMinute,
  } = dateObjFromISOString(appointment.start_date);
  const {
    year: endYear, month: endMonth, day: endDay, hour: endHour, minute: endMinute,
  } = dateObjFromISOString(appointment.end_date);

  const event = {
    start: [startYear, startMonth, startDay, startHour, startMinute],
    end: [endYear, endMonth, endDay, endHour, endMinute],
    title: appointment.title,
    description: appointment.description,
    location: 'Carrera 44 No. 72 - 131 Consultorio 308 Clínica de Diagnostico',
    geo: { lat: 10.992699903865882, lon: -74.80758433892237 },
    status: 'CONFIRMED',
    organizer: { name: 'Mariolly Del Valle', email: fromEmail },
    attendees: [
      {
        name: patient.full_name, email: patient.email, rsvp: true, partstat: 'NEED-ACTIONS', role: 'REQ-PARTICIPANT',
      },
      {
        name: 'Mariolly Del Valle', email: fromEmail, rsvp: true, partstat: 'NEED-ACTIONS', role: 'REQ-PARTICIPANT',
      },
    ],
    method: 'REQUEST',
  };

  return event;
};

module.exports = {
  eventData,
};
