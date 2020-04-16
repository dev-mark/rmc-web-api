const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const bodyParser = require("body-parser");
const cors = require("cors");
const { validateDetails } = require("./util/validators");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();

app.post("/api/email", (req, res) => {
  try {
    const { email, message, referrals, name } = req.body;
    const { errors, valid } = validateDetails(req.body);

    if (valid) {
      const oauth2Client = new OAuth2(
        process.env.CLIENT_ID, // ClientID
        process.env.CLIENT_SECRET, // Client Secret
        "https://developers.google.com/oauthplayground" // Redirect URL
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
      });

      const accessToken = oauth2Client.getAccessToken();

      const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: "RMCORDOVIZ WEBSITE <test@rmcordoviz.com>",
        to: "mark@rmcordoviz.com",
        subject: "RMC INQUIRY",
        generateTextFromHTML: true,
        html: `
     <p>This message is from the RMCordoviz website</p>
     <p><strong>NAME: </strong}>  ${name}</p>
     <p><strong>EMAIL: </strong>  ${email}</p>
     <p><strong>REFERRALS: </strong> ${referrals ? referrals : "N/A"} </p>
     <p><strong>MESSAGE: </strong></p>
     <p>   ${message}</p>
     `,
      };

      smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
          smtpTransport.close();
          res.status(400).json({ error });
        } else {
          smtpTransport.close();
          return res.status(201).json({ message: "Email sent successfully." });
        }
      });
    } else {
      res.status(400).json(errors);
    }
  } catch (err) {
    return res
      .status(500)
      .json({ general: "Something went wrong. Please try again." });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}...`);
});
