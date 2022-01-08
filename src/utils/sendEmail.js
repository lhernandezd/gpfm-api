const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.SENDGRID_EMAIL;

const sendMail = async (to, subject, html, attachments = []) => {
  const msg = {
    to,
    from: fromEmail,
    subject,
    html,
    attachments,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};

const sendMailWithTemplate = async (to, subject, template, attachments = []) => {
  const msg = {
    to,
    from: fromEmail,
    templateId: template.id,
    dynamicTemplateData: {
      subject,
      ...template.params,
    },
    attachments,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};

const sendMailWithCustomContent = async (to, subject, content, attachments = []) => {
  const msg = {
    to,
    from: fromEmail,
    subject,
    content,
    attachments,
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
  sendMailWithCustomContent,
};
