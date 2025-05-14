/**
 * Email Utility Module
 * Handles sending email notifications for daily coding challenges
 */

import nodemailer from 'nodemailer';

/**
 * Sends a reminder email for the daily coding challenge
 * @param {string} email - Recipient's email address
 * @param {string} questionTitle - Title of the daily challenge
 * @param {string} questionLink - URL link to the challenge
 * @returns {Promise<void>}
 * @throws {Error} If email sending fails
 */
const sendDailyChallengeReminder = async (email, questionTitle, questionLink) => {
  // Get email credentials from environment variables
  const senderEmail = process.env.EMAIL;
  const pass = process.env.PASS;

  // Configure email transporter using Zoho SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    secure: true,
    auth: {
      user: senderEmail,
      pass: pass,
    },
  });

  // Configure email content with HTML template
  const mailOptions = {
    from: '"Leetcoders"',
    to: email,
    subject: "Don't Miss Out on Today's Challenge!",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background-color: #fef6f6; padding: 30px; text-align: center; border-radius: 10px; border: 1px solid #ff8a80;">
          <h1 style="color: #e53935; font-size: 26px; margin-bottom: 20px;">Hey, Challenger! 🏆</h1>
          <p style="font-size: 18px; margin-bottom: 20px;">Time's ticking, and today's daily coding challenge is waiting for you!</p>
          <p style="font-size: 16px; margin-bottom: 20px;">Remember, every challenge you complete takes you one step closer to the top of the leaderboard and boosts your problem-solving skills!</p>
          <p style="font-size: 16px; margin-bottom: 20px;">Here's the link to get started:</p>
          <p style="margin-top: 20px;">
            <a href="${questionLink}" style="display: inline-block; padding: 12px 30px; font-size: 16px; color: white; background-color: #e53935; text-decoration: none; border-radius: 5px;">
              Solve Challenge Now 🚀
            </a>
          </p>
        </div>
        <div style="background-color: #f9fbe7; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 20px;">
          <p style="color: #8d8d8d; font-size: 14px;">&copy; 2024 Leetcoders. All rights reserved. | 
            <a href="mailto:lokesh@saarthi.xyz" style="color: #e53935; text-decoration: none;">Contact Us</a>
          </p>
        </div>
      </div>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendDailyChallengeReminder;
