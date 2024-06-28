import express from "express";
import { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../models/search";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

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

//Putting this .get api route below the /search route because the /search route is a dynamic route and it will match with the /:id route i.e. if I were to put the /:id route above the /search route, then the /search route would never be called as it would match with the /:id route and the /:id route would be called instead and whatever would be in the /url would be treated as the id of the hotel and the /:id route would be called even if the /url is /search

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel id is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    // 1. totalCost
    // 2. hotelId
    // 3. userId
    const { noNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const totalCost = hotel.pricePerNight * noNights;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100, //amount is in cents
      currency: "usd",
      metadata: {
        hotelId,
        userId: req.userId,
      },
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "Error creating payment intent" });
    }

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      totalCost,
    });
  }
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      //check if stripe payment successful
      const { paymentIntentId, totalCost, noNights } = req.body;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: "Payment intent not fount" });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment does not match" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message:
            "Payment not successful. Current status: " + paymentIntent.status,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      }

      const hotel = await Hotel.findOneAndUpdate({_id: req.params.hotelId}, {
        $push: {bookings: newBooking}
      })

      if(!hotel){
        return res.status(404).json({message: "Hotel not found"})
      }

      await hotel.save();
      res.status(201).json({message: "Booking successful"})

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" }).send();
    }
  }
);

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

    console.log("starRatings", starRatings);

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
