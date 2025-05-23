const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config(); // Enable reading from .env in local development

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// ✅ Secure: Read credentials from environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. your Gmail address
    pass: process.env.EMAIL_PASS, // e.g. your Gmail app password
  },
});

app.post("/send-email", (req, res) => {
  console.log('Received in /send-email:', req.body); // Added for debugging
  const { name, phoneNumber } = req.body; // Simplified destructuring

  if (!name || !phoneNumber) {
    return res.status(400).json({ error: "Name and phone number are required." });
  }

  // Simplified mailOptions for initial contact only
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Sending to yourself
    subject: "New Form Submission - AI Recommendation Tool",
    html: `
      <p>Hello,</p>
      <p>You have received a new submission:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Phone Number:</strong> ${phoneNumber}</li>
      </ul>
      <p>Regards,<br/>Qobouli Bot</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email", details: error.message });
    }
    console.log("Email sent: " + info.response);
    res.status(200).json({ message: "Email sent successfully!" });
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend server running at http://0.0.0.0:${port}`);
});
