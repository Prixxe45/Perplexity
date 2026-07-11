import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import morgan from "morgan"
import cors from "cors"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173",
     "https://paper-ai2.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);


app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);


app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});


export default app;
