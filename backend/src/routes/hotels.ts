import express from "express";
import { Request, Response } from "express";
import Hotel from "../models/hotel";
import { parse } from "path";
import { HotelSearchResponse } from "../models/search";

const router = express.Router();

//api/hotels/search?
router.get("/search", async (req: Request, res: Response) => {
  try {
    console.log(req.query, "query params");
    const searchQuery = constructSearchQuery(req.query);
    console.log(searchQuery, "search query");

    let sortOptions = {};

    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
      default:
        sortOptions = { starRating: -1 };
        break;
    }

    //pagination
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    const skip = (pageNumber - 1) * pageSize; //skip the previous pages and items on those pages

    //when no search params are provided
    const hotels = await Hotel.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    const totalHotels = await Hotel.countDocuments(searchQuery);
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

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCapacity) {
    constructedQuery.adultCapacity = {
      $gte: parseInt(queryParams.adultCapacity),
    };
  }

  if (queryParams.childCapacity) {
    constructedQuery.childCapacity = {
      $gte: parseInt(queryParams.childCapacity),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : [parseInt(queryParams.stars)];

      console.log("starRatings", starRatings)

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;
