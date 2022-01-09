const validator = require('validator');
const ics = require('ics');
const capitalize = require('lodash/capitalize');
const paginate = require('../utils/paginate');
const { sendMailWithTemplate } = require('../utils/sendEmail');
const { eventData } = require('../utils/calendarEventData');
const { dateObjFromISOString } = require('../utils/dates');
const db = require('../models');

const Appointment = db.appointment;
const Patient = db.patient;
const City = db.city;
const State = db.state;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const appointment = await Appointment.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Patient,
            include: [{
              model: City,
              include: [State],
            }],
          },
        ],
      });
      if (appointment) {
        req.appointment = appointment;
        next();
      } else {
        next({
          statusCode: '404',
          message: 'Resource not found',
        });
      }
    } else {
      next({
        statusCode: '404',
        message: 'Resource not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.all = async (req, res, next) => {
  const { page = 0, pageSize = 200 } = req.query;
  try {
    const { rows, count } = await Appointment.findAndCountAll({
      where: {},
      ...paginate({ page, pageSize }),
      include: [
        {
          model: Patient,
          include: [{
            model: City,
            include: [State],
          }],
        },
      ],
    });
    const pages = Math.ceil(count / pageSize);
    res.json({
      data: rows,
      success: true,
      statusCode: '200',
      meta: {
        page: parseInt(page, 10) + 1,
        pageSize: parseInt(pageSize, 10),
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.read = async (req, res, next) => {
  const { appointment = {} } = req;
  if (appointment) {
    res.json({
      data: appointment,
      success: true,
      statusCode: '200',
    });
  }
};

exports.delete = async (req, res, next) => {
  const { appointment = {} } = req;
  try {
    const deleted = appointment.destroy();
    res.json({
      data: deleted,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const { appointment = {} } = req;
  const { ...appointmentData } = req.body;
  try {
    const appointmentUpdated = await appointment.update({
      ...appointmentData,
      updated_by_id: req.userId,
    });
    if (req.body.patient_id) {
      await Patient.findOne({
        where: {
          id: req.body.patient_id,
        },
      }).then((patient) => {
        appointment.setPatient(patient);
      });
    }
    const appointmentQuery = await Appointment.findOne({
      where: {
        id: appointmentUpdated.id,
      },
      include: [
        {
          model: Patient,
          include: [{
            model: City,
            include: [State],
          }],
        },
      ],
    });
    res.json({
      data: appointmentQuery,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  // Save Appointment to Database
  const { ...appointmentData } = req.body;
  try {
    const appointment = await Appointment.create({
      ...appointmentData,
      created_by_id: req.userId,
      updated_by_id: req.userId,
    });
    if (req.body.patient_id) {
      const patientForAppointment = await Patient.findOne({
        where: {
          id: req.body.patient_id,
        },
      });

      await appointment.setPatient(patientForAppointment);

      const subject = 'Cita Agendada';
      const event = eventData(appointmentData, patientForAppointment);

      const { value } = ics.createEvent(event);

      const attachments = [
        {
          content: Buffer.from(value).toString('base64'),
          type: 'application/ics',
          namw: 'invite.ics',
          filename: 'invite.ics',
          disposition: 'attachment',
        },
      ];

      const {
        year: startYear, month: startMonth, day: startDay, hour: startHour, minute: startMinute,
      } = dateObjFromISOString(appointmentData.start_date, 'yyyy/MMMM/d/H/mm', 'es');
      const template = {
        id: process.env.APPOINTMENT_EMAIL_TEMPLATE,
        params: {
          name: patientForAppointment.full_name,
          date: `${capitalize(startMonth)} ${startDay}, ${startYear}`,
          hour: `${startHour}:${startMinute}`,
        },
      };

      const fromEmail = process.env.SENDGRID_EMAIL;
      const to = [patientForAppointment.email, fromEmail];

      await sendMailWithTemplate(to, subject, template, attachments);
      res.send({ message: 'Appointment was registered successfully!' });
    } else {
      throw new Error('Patient required');
    }
  } catch (error) {
    next({
      statusCode: '404',
      message: error.message,
    });
  }
};
