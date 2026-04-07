import {connectDB} from './config/db.js';
import todoRoutes from './routes/todo.routes.js';
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';
import express from "express";
import cors from 'cors';
const app = express();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173', // allow your frontend
  credentials: true
}));
app.use(express.json());
app.use("/api",todoRoutes);
app.use("/auth",authRoutes)
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is listening on port ${PORT}`);
});