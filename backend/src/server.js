import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import { connectionDB } from "./libs/db.js";
import authRoutes from "./routes/authRoutes.js"; 
import taskRoutes from "./routes/taskRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Các Middlewares
app.use(cors()); 
app.use(express.json()); 


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


app.get("/", (req, res) => {
  res.send("API Smart Todo List đang hoạt động ổn định!");
});


connectionDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Không thể khởi động server do lỗi kết nối DB:", err);
});