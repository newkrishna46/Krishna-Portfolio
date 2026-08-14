const express = require("express");
const nodemailer = require("nodemailer");
const Message = require("../models/message");

const router = express.Router();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    
});

router.post("/", async (req, res) => {
    console.log("🔥 MESSAGE ROUTE REACHED");

    try {
        const { name, email, message } = req.body;

        console.log("1. Request received");

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        console.log("2. Saving to MongoDB...");

        const newMessage = new Message({
            name: name,
            email: email,
            message: message
        });

        await newMessage.save();

        console.log("3. MongoDB saved successfully");

        console.log("4. Sending email...");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Portfolio Message from ${name}`,
            text: `Name: ${name}

Email: ${email}

Message:
${message}`
        };

        await transporter.sendMail(mailOptions);

        console.log("5. Email sent successfully");

        return res.status(200).json({
            success: true,
            message: "Message submitted successfully!"
        });

    } catch (error) {
        console.error("🔥 FULL ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;