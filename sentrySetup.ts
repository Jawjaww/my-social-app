
import "./env.d.ts"
import * as Sentry from "@sentry/react-native";
import { SENTRY_DSN } from "@env";

// Initialize Sentry
Sentry.init({
  dsn: SENTRY_DSN,
  debug: true, // Set to false in production
});

export default Sentry;
