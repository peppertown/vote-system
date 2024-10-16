import express from 'express';
import './loadEnv.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users.js';
import questionRouter from './routes/questions.js';
import statRouter from './routes/stats.js';

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(cookieParser()); // 쿠키 파서 미들웨어 추가

// 포트번호를 환경변수로 설정해주세요.
const PORT_NUMBER = process.env.PORT_NUMBER || 7777;

app.use('/users', userRouter);
app.use('/surveys', questionRouter);
app.use('/surveys', statRouter);

app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
