import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
// import createPost
import postRoutes from "./routes/post.js";

import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//congif //

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//filestorage//

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//Routes with files//

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/post", postRoutes);

//mongoose//

mongoose
  .connect("mongodb://127.0.0.1:27017/social-media", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(8000, () => {
      console.log("connected");
    });
  });
