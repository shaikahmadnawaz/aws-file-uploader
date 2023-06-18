import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.AWS_ACCOUNT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCOUNT_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCOUNT_SECRET_ACCESS_KEY,
  },
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB in bytes
  },
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const contentType = file.mimetype;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: contentType,
    };

    const response = await s3Client.send(new PutObjectCommand(params));
    console.log("File uploaded to S3:", response);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.originalname}`;

    res.status(200).json({ fileUrl });
  } catch (error) {
    console.error("Failed to upload file to S3:", error);
    res.status(500).json({ error: "Failed to upload file to S3" });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
