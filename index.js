import express from "express";
import { cron } from "./controllers/cron.js";

const app = express();

app.use("/cron", cron);

const PORT = process.env.PORT || 8282;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
