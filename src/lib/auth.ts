import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { anonymous } from "better-auth/plugins";
import * as authSchema from "../db/schema-auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      ...authSchema,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },
  plugins: [anonymous()],
});
