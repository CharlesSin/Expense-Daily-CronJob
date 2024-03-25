import "dotenv/config";

import getNow from "../utils/getNow.js";
import customLogsInfo from "./logging.js";
import client from "../config/mongoDBConnect.js";
import backupAccountData from "../utils/backupAccountData.js";
import fireConfig from "../config/firebaseConnect.config.js";

import twentyOne from "../mock/2021.json" assert { type: "json" };
import twentyTwo from "../mock/2022.json" assert { type: "json" };
import twentyThree from "../mock/2023.json" assert { type: "json" };

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    customLogsInfo(`Time: ${getNow()}`);
    customLogsInfo("Pinged your deployment. You successfully connected to MongoDB!");

    // Database Name
    const dbName = "DailyBackupGKE";
    const db = client.db(dbName);
    const randomNumber = `${Math.random() * 100000}`;
    const nowString = getNow();

    // const thisYearData = await backupAccountData(`Account${new Date().getFullYear()}`);
    const collection = db.collection(nowString);
    // const finalData = [...twentyOne, ...twentyTwo, ...twentyThree, ...thisYearData];
    const finalData = [...twentyOne, ...twentyTwo, ...twentyThree];

    // const firestoreDb = fireConfig.firestore();
    // await firestoreDb
    //   .collection("demo")
    //   .doc(`${nowString}_${Number.parseFloat(randomNumber).toFixed()}`)
    //   .set({ DATE: nowString, TOTAL: finalData.length, TYPE: process.env.LOGGING_TYPE });

    customLogsInfo(`Time: ${getNow()}`);
    customLogsInfo(`FinalData.length: ${finalData.length}`);

    const date = new Date();
    console.log("------------------ TIMEZONE AREA ------------------");
    console.log(`date.toString(): ${date.toString()}`);
    function convertTZ(date, tzString) {
      return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
    }

    // Bonus: You can also put Date object to first arg
    convertTZ(date, "Asia/Taipei"); // current date-time in jakarta.
    console.log("process.env.TZ: ");
    console.log(process.env.TZ);
    console.log("process.env.DAY_OF_WEEK: ");
    console.log(process.env.DAY_OF_WEEK);
    console.log("process.env.DATE_OF_MONTH: ");
    console.log(process.env.DATE_OF_MONTH);

    console.log("------------------ TIMEZONE AREA ------------------");

    const insertData = await collection.insertMany(finalData);
    customLogsInfo(`insertData: ${JSON.stringify(insertData)}`);
    setTimeout(() => {
      console.log("waiting for 100001ms");
    }, 100001);
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
