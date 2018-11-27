const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const logger = require('../utils/logger');

const Email = require("../models/email");

const options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  }
};

const mailer = nodemailer.createTransport(sgTransport(options));

exports.send_email = (req, res, err) => {
  if (err) {
    logger.error('Error making request to emailController', err);
    throw err;
  };

  const { to, from, subject, body } = req.body
  const email = {
    to,
    from,
    subject,
    body,
    html: `<h1>${body}</h1>`,
    sent: false,
  };

  const savedEmail = new Email(email);
  let id;

  savedEmail.save((err, res) => {
    if (err) {
      logger.error(`Error saving email object to MongoDB: ${err}`);
      throw err;
    }

    id = res._id;
    logger.info('saved to mongoDB', id);
  });

  mailer.sendMail(email, (err, sendGridRes) => {
    if (err || sendGridRes.message !== 'success') {
      const error = `An error has occurred while attempting to send email. The response from Sendgrid is: ${sendGridRes.message}, and the error object is ${err}`;
      logger.error(error);
      res.status(500).json({ message: error});
      throw(err || sendGridRes);
    }
    // Update previously saved email to reflect succesful send
    Email.findOneAndUpdate({_id: id}, { sent: true }, ((err, res) => {
      if (err) {
        const error = `Error saving email to MongoDB: ${err}`
        logger.error(error);
        res.status(500).json({ message: error});
        throw (error);
      }
      logger.info(`Saved email with ID: ${id}`)
    }))
    const msg = `Successfully sent email to ${email.to}. Sendgrid responded with: ${sendGridRes.message}`;
    logger.info(msg);
    res.status(200).json({ message: msg });
  });
};

// Display list of all emails.
exports.get_emails = (req, res) => {
  Email.find().exec((err, emails) => {
    if (err) {
      const error = `Error retrieving emails from MongoDB: ${err}`
      logger.error(error);
      res.status(500).json({ message: error});
      throw (error);
    }
    // Successful, so send data
    logger.info(`Retrieving array of emails with length of ${emails.length}`);
    res.type("json");
    res.status(200).json({ emails });
  });
};

// Get email based on ID.
exports.get_single_email = (req, res) => {
  if (!req.params.id) {
    const error = "No ID supplied in request";
    res.status(500).json({ message: error });
  };
  const id = req.params.id;
  Email.findOne({
    _id: id
  }).exec((err, emails) => {
    if (err) {
      logger.error(err);
      res.status(500).json({ message: err });
      throw (err);
    }
    // Successful, so send data
    logger.info(`Retrieving email with ID of ${id}`);
    res.type("json");
    res.status(200).json({ emails });
  });
};

// Handle request for EMAILS by a given email address
exports.get_user_emails = (req, res) => {
  if (!req.params.email) {
    res.status(500).json({ message: "No email supplied in request" });
  };
  const emailAddress = req.params.email;
  Email.find({
    $and : [{ $or : [ { to : emailAddress }, { from : emailAddress } ] }]
  }).exec((err, emails) => {
    if (err) {
      logger.error(err);
      res.status(500).json({ message: err });
      throw (err);
    }
    logger.info(`Retrieving emails ${emails.length} of the user ${emailAddress}`);
    res.type("json");
    res.status(200).json({ emails });
  });
};

