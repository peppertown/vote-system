import express from 'express';
const app = express();

import 'dotenv/config';
import statRouter from './routes/stats.js';

const PORT_NUMBER = process.env.PORT_NUMBER;

app.use('/stats', statRouter);

app.listen(PORT_NUMBER);
