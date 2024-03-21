import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

import getNow from "../utils/getNow.js";
import customLogsInfo from "./logging.js";

import twentyOne from "../mock/2021.json" assert { type: "json" };
import twentyTwo from "../mock/2022.json" assert { type: "json" };
import twentyThree from "../mock/2023.json" assert { type: "json" };

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URL, {
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
    customLogsInfo(`Time: ${getNow()}`);
    customLogsInfo("Pinged your deployment. You successfully connected to MongoDB!");

    // Database Name
    const dbName = "DailyBackup";
    const db = client.db(dbName);

    const nowString = getNow();

    const collection = db.collection(nowString);
    const finalData = [...twentyOne, ...twentyTwo, ...twentyThree];

    customLogsInfo(`Time: ${getNow()}`);
    customLogsInfo(`FinalData.length: ${finalData.length}`);

    await collection.insertMany(finalData);
  } finally {
    // Ensures that the client will close when you finish/error
    customLogsInfo(`Client close connection: ${getNow()}`);
    await client.close();
  }
}

export const cron = () => {
  // Writes some log entries
  customLogsInfo(`Start Backup: ${getNow()}`);
  run().catch(console.dir);
  customLogsInfo(`Complete Backup: ${getNow()}`);
};
