import { LoggingWinston } from "@google-cloud/logging-winston";
import winston from "winston";

const loggingWinston = new LoggingWinston();

// Create a Winston logger that streams to Cloud Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = winston.createLogger({
  level: { info: 0, ok: 1, error: 2 },
  transports: [
    new winston.transports.Console(),
    // Add Cloud Logging
    loggingWinston,
  ],
});

function customLogsInfo(logText) {
  process.env.LOGGING_TYPE === "MONGO_DB" ? console.log(logText) : logger.info(logText);
}

export default customLogsInfo;
