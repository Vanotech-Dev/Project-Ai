import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import "dotenv/config";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        }
    }),
    trustedOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173")
        .split(",")
        .map((o) => o.trim()),
    emailAndPassword: {
        enabled: true,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24, // update session if older than 1 day
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                // Because we don't have a real SMTP server configured locally,
                // we will log the OTP to the console.
                console.log("\n==========================================");
                console.log(`📧 SIMULASI PENGIRIMAN EMAIL OTP (${type})`);
                console.log(`Kepada : ${email}`);
                console.log(`KODE   : ${otp}`);
                console.log("==========================================\n");
            },
        })
    ],
    // To enable Google OAuth, we uncomment this and add the Google Client IDs to .env
    // socialProviders: {
    //     google: {
    //         clientId: process.env.GOOGLE_CLIENT_ID!,
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //     }
    // }
});
