const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();

app.post("/api/email", (req, res) => {
  const { email, message, referrals, name } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  let messageFormat = `
  <p>This message is from the RMCordoviz website</p>

  <p><strong>NAME: </strong}>  ${name}</p>
  <p><strong>EMAIL: </strong>  ${email}</p>
  <p><strong>REFERRALS: </strong>  ${referrals ? referrals : "N/A"}</p>
  <p><strong>MESSAGE: </strong></p>
  <p>   ${message}</p>
  
  `;

  let mailContent = {
    from: "RMCordoviz Website <mark@rmcordoviz.com>", // sender address
    to: "mark@rmcordoviz.com", // list of receivers
    subject: "INQUIRY", // Subject line
    text: `message: ${message} `, // plain text body
    html: messageFormat,
  };

  //   //   send email
  transporter.sendMail(mailContent, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      console.log("done");
      return res.status(201).json({ message: "Email sent successfully." });
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}...`);
});
