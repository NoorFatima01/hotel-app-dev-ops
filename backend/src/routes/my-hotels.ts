import express from "express";
import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import { client } from "../index";
import multer from "multer";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body, validationResult } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

async function uploadToBucket(files: Express.Multer.File[]): Promise<string[]> {
  const uploadedLinks = await Promise.all(
    files.map(async (file) => {
      const fileExt = mime.extension(file.mimetype);
      console.log(file);
      const fileName = file.originalname;
      if (!fileExt) {
        throw new Error("Invalid file type");
      }

      const newFileName = `${fileName}-${Date.now()}`;

      const params = {
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: `${fileName}-${Date.now()}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await client.send(new PutObjectCommand(params));
      return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${newFileName}`;
    })
  );

  return uploadedLinks;
}

//this will be the root
router.post(
  "/",
  verifyToken, //only logged in users can create hotels
  upload.array("imageFiles", 6),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night must be a number"),
    body("adultCapacity")
      .notEmpty()
      .isNumeric()
      .withMessage("Adult capacity must be a number"),
    body("childCapacity")
      .notEmpty()
      .isNumeric()
      .withMessage("Child capacity must be a number"),
    body("starRating")
      .notEmpty()
      .isNumeric()
      .withMessage("Star rating must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities must be an array"),
  ],
  async (req: Request, res: Response) => {
    console.log("req body");
    console.log(req.body);
    console.log("Headers:", req.headers);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Bad Request", errors: errors.array() });
    }
    try {
      const files = req.files as Express.Multer.File[];
      console.log(files);

      const imageUrls = await uploadToBucket(files);
      console.log("imageUrls", imageUrls);

      const newHotel: HotelType = req.body; //some of the fields will already be filled by the req body
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId; //this is taken from the auth token

      //save the hotel to the database
      const hotel = new Hotel(newHotel);
      await hotel.save();
      res.status(201).send(hotel); //201 is the status code for created
    } catch (error) {
      console.log("error creating hotel", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.status(200).json(hotels);
  } catch (error) {
    console.log("error getting hotels", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

//specific hotel by id
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id.toString();
    const hotel = await Hotel.findOne({ _id: id, userId: req.userId });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.log("error getting hotel", error);
    res.status(500).json({ message: "Error fetching hotel" });
  }
});

//update hotel
router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId, userId: req.userId },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(400).json("Hotel not found");
      }

      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadToBucket(files); // if the user uploaded new images, they will be uploaded to AWS, and their URLs will be stored here

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ]; // if the user deleted any image, then whatever images are left will be sent in the req

      await hotel.save();
      console.log("hotel found", hotel);
      return res.status(200).json(hotel);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
