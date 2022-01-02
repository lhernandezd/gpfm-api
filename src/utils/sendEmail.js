const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.SENDGRID_EMAIL;

const sendMail = async (to, subject, html) => {
  const msg = {
    to,
    from: fromEmail,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};

const sendMailWithTemplate = async (to, subject, template) => {
  const msg = {
    to,
    from: fromEmail,
    templateId: template.id,
    dynamicTemplateData: {
      subject,
      ...template.params,
    },
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendMail,
  sendMailWithTemplate,
};
