import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    // =========================
    // EMAIL / PASSWORD LOGIN
    // =========================
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials): Promise<any> {
        await dbConnect();

        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Email/Username and password are required");
          }

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email or username");
          }

          if (!user.isVerified) {
            throw new Error(
              "Please verify your account before login"
            );
          }

          // Google users don't have a password
          if (!user.password) {
            throw new Error(
              "This account uses Google login. Please continue with Google."
            );
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect Password");
          }

          return user;
        } catch (err: any) {
          throw new Error(err.message || "Authentication failed");
        }
      },
    }),

    // =========================
    // GOOGLE LOGIN
    // =========================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // This runs when a user signs in
    async signIn({ user, account }) {
      // Google login
      if (account?.provider === "google") {
        try {
          await dbConnect();

          if (!user.email) {
            return false;
          }

          // Check whether user already exists
          let existingUser = await UserModel.findOne({
            email: user.email,
          });

          if (!existingUser) {
            // Create a username from Google name/email
            let baseUsername =
              user.name?.replace(/\s+/g, "").toLowerCase() ||
              user.email.split("@")[0];

            let username = baseUsername;

            // Make username unique
            let usernameExists = await UserModel.findOne({
              username,
            });

            let counter = 1;

            while (usernameExists) {
              username = `${baseUsername}${counter}`;

              usernameExists = await UserModel.findOne({
                username,
              });

              counter++;
            }

            // Create Google user
            existingUser = await UserModel.create({
              username,
              email: user.email,

              // Google users don't need these
              password: undefined,
              verifyCode: undefined,
              verifyCodeExpiry: undefined,

              // Google already authenticated the account
              isVerified: true,

              isAcceptngMessage: true,
              messages: [],
            });
          } else {
            // Existing user
            // Google authentication means we can mark it verified
            existingUser.isVerified = true;

            await existingUser.save();
          }

          // Attach our MongoDB user ID to NextAuth user
          user._id = existingUser._id.toString();
          user.username = existingUser.username;
          user.isVerified = existingUser.isVerified;
          user.isAcceptingMessages =
            existingUser.isAcceptngMessage;

          return true;
        } catch (error) {
          console.error(
            "Error during Google authentication:",
            error
          );

          return false;
        }
      }

      // Credentials login
      return true;
    },

    // =========================
    // JWT
    // =========================
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();

        token.isVerified = user.isVerified;

        token.isAcceptingMessages =
          user.isAcceptingMessages;

        token.username = user.username;
      }

      return token;
    },

    // =========================
    // SESSION
    // =========================
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;

        session.user.isVerified = token.isVerified;

        session.user.isAcceptingMessages =
          token.isAcceptingMessages;

        session.user.username = token.username;
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};