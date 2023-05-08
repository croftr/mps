import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import statusRouter from './src/routes/statusRouter';
import indexRouter from './src/routes/indexRouter';
import mpStatsRouter from './src/routes/mpStatsRouter';

import { gatherStats } from './src/workflow/gatherStats';
import { log } from 'console';

dotenv.config()

const app: Express = express();
const port = process.env.PORT;

app.use("/", indexRouter);
app.use("/status", statusRouter);
app.use("/mps", mpStatsRouter);  

app.listen(port, () => {  
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  gatherStats();
});