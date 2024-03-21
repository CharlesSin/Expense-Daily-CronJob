import "dotenv/config";
import { LoggingWinston } from "@google-cloud/logging-winston";
import winston from "winston";
import { MongoClient, ServerApiVersion } from "mongodb";

import getNow from "../utils/getNow.js";

import twentyOne from "../mock/2021.json" assert { type: "json" };
import twentyTwo from "../mock/2022.json" assert { type: "json" };
import twentyThree from "../mock/2023.json" assert { type: "json" };

const loggingWinston = new LoggingWinston();

// Create a Winston logger that streams to Cloud Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    // Add Cloud Logging
    loggingWinston,
  ],
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient("mongodb+srv://cronjob-4-mongodb:cronjob-4-mongodb@cluster0.pooey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    logger.info(`Time: ${getNow()}`);
    logger.info("Pinged your deployment. You successfully connected to MongoDB!");

    // Database Name
    const dbName = "DailyBackup";
    const db = client.db(dbName);

    const nowString = getNow();

    const collection = db.collection(nowString);
    const finalData = [...twentyOne, ...twentyTwo, ...twentyThree];

    logger.info(`Time: ${getNow()}`);
    logger.info(`FinalData.length: ${finalData.length}`);

    const insertResult = await collection.insertMany(finalData);
    // logger.info("Time: ", getNow());
    // logger.info("Inserted documents =>: ", JSON.stringify(insertResult));
  } finally {
    // Ensures that the client will close when you finish/error
    logger.info(`Client close connection: ${getNow()}`);
    await client.close();
  }
}

export const cron = () => {
  // Writes some log entries
  logger.info(`Start Backup: ${getNow()}`);
  run().catch(console.dir);
  logger.info(`Complete Backup: ${getNow()}`);
};
