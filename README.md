# MstryMessage

**MstryMessage** is an anonymous messaging platform built with **Next.js** that allows users to create a public profile and receive anonymous messages through a shareable link. It also uses **Google Gemini** to generate message suggestions for users who want inspiration before sending an anonymous message.

## 🚀 Live Demo

**Coming Soon**

> **Note:** The project currently uses a temporary/local deployment configuration and does not have a custom domain.

## ✨ Features

* 🔐 **Authentication**

  * Sign up and sign in using credentials
  * Google OAuth authentication
  * Secure session management with NextAuth

* 📧 **Email Verification**

  * Verification-code based account verification
  * Verification codes are handled through Resend
  * Email verification requires a configured and verified sending domain

* 👤 **Public User Profiles**

  * Every user gets a unique public profile
  * Shareable profile URL for receiving anonymous messages

* 💬 **Anonymous Messaging**

  * Anyone can send anonymous messages through a user's public profile
  * Message sender identity is not revealed to the recipient

* 📥 **Message Management**

  * View received messages from the dashboard
  * Delete individual messages
  * Enable or disable receiving messages

* 🤖 **AI-Powered Message Suggestions**

  * Uses Google Gemini to generate creative anonymous-message suggestions
  * Helps users who are unsure what message to send

* 📱 **Responsive UI**

  * Designed to work across desktop and mobile devices

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* Next.js API Routes
* NextAuth
* MongoDB
* Mongoose

### AI & Services

* Google Gemini API
* Resend
* Google OAuth

### Development

* Node.js
* Git & GitHub

## 🏗️ How It Works

1. A user creates an account or signs in using Google.
2. The user receives a unique public profile URL.
3. The user shares their profile link with others.
4. Visitors can send anonymous messages without revealing their identity.
5. The user can view and manage received messages from the dashboard.
6. Gemini can generate message suggestions for visitors who need inspiration.

## 🔑 Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
MONGODB_URI=

RESEND_API_KEY=

NEXTAUTH_SECRET=

NEXTAUTH_URL=

GOOGLE_GENERATIVE_AI_API_KEY=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=
```

A sample configuration is available in `.env.sample`.

> **Important:** Never commit your actual `.env` file or API keys to GitHub.

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mstrymessage.git
cd mstrymessage
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and add the required credentials.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Production build

To create and test the production build:

```bash
npm run build
npm run start
```

## ⚠️ Email Verification & Demo Usage

The credentials-based signup flow uses **Resend** to send verification emails.

Because this project is currently running **without a purchased/verified custom domain**, the Resend email-sending configuration is not intended to provide unrestricted email delivery for the live demo.

### For the easiest way to try the application:

**Use the "Continue with Google" option to sign in.**

This allows you to access the application without depending on the email-verification flow.

> The credentials-based signup and verification functionality is implemented in the project, but sending verification emails in a production environment requires a properly configured and verified sending domain with Resend.

## 🔒 Security

* Environment variables are excluded from version control.
* Authentication is handled using NextAuth.
* Passwords are securely handled during credential authentication.
* MongoDB is used for persistent data storage.
* API routes validate authenticated requests where required.

## 📂 Project Structure

```text
mstrymessage/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── verify/
│   │   └── u/
│   ├── components/
│   ├── lib/
│   └── model/
├── public/
├── .env.sample
├── .gitignore
├── package.json
└── README.md
```

## 🎯 Future Improvements

* Custom domain and production email configuration
* Improved moderation and spam protection
* More advanced AI-powered message generation
* Message reporting and abuse prevention
* Additional authentication providers
* Further UI and accessibility improvements

## 👨‍💻 Author

**Jilani Sheikh**

Built as a full-stack project to explore modern web development with **Next.js, TypeScript, MongoDB, NextAuth, and Generative AI**.
