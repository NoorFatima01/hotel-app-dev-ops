import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";

mongoose.connect(process.env.MONGODB_URI as string);

export const client = new S3Client({
  region: process.env.S3_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // set this to EC2 public IP or domain
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);

// ✅ Serve frontend build
// Decide path based on env
const frontendPath =
  process.env.DEPLOY_ENV === "ec2"
    ? path.join(__dirname, "public")   // Docker: /app/dist/public
    : path.join(__dirname, "../../frontend/dist"); // Local dev
app.use(express.static(frontendPath));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

//
//In the provided code snippet, the app.use(cors(...)) middleware is being used to configure Cross-Origin Resource Sharing (CORS) for a Node.js application. CORS is a security feature implemented by web browsers to restrict webpages from making requests to a different domain than the one that served the original webpage. This restriction is known as the same-origin policy.

//When you're building a web application, there are scenarios where you might want to make requests from a frontend (typically running on a different domain or port) to a backend server. CORS headers help in relaxing the same-origin policy, allowing these cross-origin requests under controlled conditions.

// Here's an explanation of the options used in your cors middleware:

// origin: Specifies the origin (or origins) that are allowed to access the resources on the server. In your case, you've set it to "http://localhost:7000", meaning that requests from this specific origin are allowed. You can also use a wildcard "*" to allow any origin, but this is less secure and should be used cautiously.

// credentials: When set to true, it indicates that the server should include credentials (such as cookies, HTTP authentication, and client certificates) in the cross-origin request. This is important when you're dealing with authentication or other scenarios where cookies need to be sent with the request.
