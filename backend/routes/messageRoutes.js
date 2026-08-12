const express = require("express");
const nodemailer = require("nodemailer");
const Message = require("../models/message");

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post("/", async (req, res) => {

    try {

        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        // Save message to MongoDB
        const newMessage = new Message({
            name,
            email,
            message
        });

        await newMessage.save();

        // Send email to you
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Portfolio Message from ${name}`,
            text: `
Name: ${name}
Email: ${email}

Message:
${message}
            `
        });

        res.status(200).json({
            success: true,
            message: "Message submitted successfully!"
        });

    } catch (error) {

        console.error("Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
});

module.exports = router;