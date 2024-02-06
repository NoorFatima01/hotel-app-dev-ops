import express from "express";
import { Request, Response } from "express";
import Hotel from "../models/hotel";
import { parse } from "path";
import { HotelSearchResponse } from "../models/search";

const router = express.Router();

//api/hotels/search?
router.get("/search", async (req: Request, res: Response) => {
  try {
    //pagination
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    const skip = (pageNumber - 1) * pageSize; //skip the previous pages and items on those pages

    //when no search params are provided
    const hotels = await Hotel.find().skip(skip).limit(pageSize);
    const totalHotels = await Hotel.countDocuments();
    console.log(totalHotels, "total hotels");
    const p = Math.ceil(totalHotels / pageSize);
    const resposne: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total: totalHotels,
        page: pageNumber,
        pages: p,
      },
    };

    res.json(resposne);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
