import { drizzle } from "drizzle-orm/libsql";

import * as schema from "../db/schema";
import * as auth from "../db/schema-auth";

export const db = drizzle({
  connection: process.env.DB_FILE_NAME!,
  casing: "snake_case",
  schema: {
    ...schema,
    ...auth,
  },
});
