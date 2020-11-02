const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/send", async (req, res) => {
  const EmailAddress = process.env.EMAIL_ADDRESS;
  const transporter = nodemailer.createTransport({
    host: "smtp.live.com",
    port: 587,
    secure: false,
    auth: {
      user: EmailAddress,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail(
    {
      from: req.body.email,
      to: EmailAddress,
      subject: "Email from Sportscar app",
      text: `name: ${req.body.name} 
      current-role:${req.body.role} 
      sports-car" ${req.body.enthusiast} 
      comment:${req.body.comment}`,
    },
    (err, data) => {
      if (err) {
        console.log("error", err);
      } else {
        res.sendStatus(200).console.log("email sent");
      }
    }
  );
});

module.exports = router;
