import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.js';

dotenv.config();

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(cookieParser()); // 쿠키 파서 미들웨어 추가

// 포트번호를 환경변수로 설정해주세요.
const PORT_NUMBER = process.env.PORT_NUMBER || 7777;

app.use('/users', userRouter);

app.use('/stats', statRouter);

app.listen(PORT_NUMBER);
