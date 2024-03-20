import express from "express";
import { cron } from "./controllers/cron.js";

const app = express();

app.use("/cron", cron);
