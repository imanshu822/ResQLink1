const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const Agent = require("../models/agentModel");
const validateMongoDbId = require("../utils/validateMongodbId");

const sendEmail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id); // Validate the MongoDB ID
  const agent = await Agent.findById(id);

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ID, // your email
      pass: process.env.MP, // your email password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Hey 👻" <imanshu822@gmail.com>', // sender address
    to: agent.email, // agent's email address
    subject: "Agent Registration Information", // Subject line
    text: `Dear Agent,\n\nThank you for registering. Here are your login details:\n\nEmail: ${agent.email}\nPassword: ${agent.password}\n\nPlease keep this information safe.\n\nBest regards,\nYour ResQLink `, // plain text body
    html: "", // html body
  });

  // console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Stop the execution here
  res.json({
    message: "Email sent successfully",
  });
  return;
});

module.exports = { sendEmail };
