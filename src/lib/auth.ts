import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import nodemailer from "nodemailer";

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL || "http://localhost:4000"],

  // User Schema Extensions
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  // Email and Password Configuration
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  // Email Verification Handler
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true, 
    sendVerificationEmail: async ({ user, url, token }) => {
      const baseUrl = process.env.APP_URL || "http://localhost:3000";
      const verificationURL = `${baseUrl}/verify-email?token=${token}`;

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; color: #1f2937;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #111827; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Verify Your Email</h2>
          </div>
          <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 0;">Hi ${user.name || "there"},</p>
          <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">Thank you for creating an account. To complete your registration and secure your profile, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationURL}" target="_blank" style="background-color: #111827; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 6px; display: inline-block; transition: background-color 0.2s ease;">Verify Email Address</a>
          </div>
          
          <p style="font-size: 13px; line-height: 1.5; color: #6b7280; margin-bottom: 0;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size: 13px; line-height: 1.5; color: #2563eb; word-break: break-all; margin-top: 5px;">${verificationURL}</p>
          
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 30px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">If you did not request this email, you can safely ignore it.</p>
        </div>
      `;

      try {
        const info = await transporter.sendMail({
          from: `"Next Blog" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: "Verify your email address - Next Blog",
          text: `Hi ${user.name}, please verify your email by visiting this link: ${verificationURL}`, // Plain text fallback-এও
          html: emailHtml,
        });

        console.log("Verification email sent successfully: %s", info.messageId);
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
