import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

AppDataSource.initialize().then(() => {
  console.log("Database connected");
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}).catch(err => {
  console.error("Error during Data Source initialization", err);
});
