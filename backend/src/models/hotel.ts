import mongoose from "mongoose";
import { BookingType } from "./search";

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  description: string;
  city: string;
  country: string;
  type: string;
  pricePerNight: number;
  adultCapacity: number;
  childCapacity: number;
  imageUrls: string[];
  facilities: string[];
  starRating: number;
  lastUpdated: Date;
  bookings: BookingType[];
};

const bookingSchema = new mongoose.Schema<BookingType>({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  adultCapacity: { type: Number, required: true },
  childCapacity: { type: Number, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalCost: { type: Number, required: true },
});


const hotelSchema = new mongoose.Schema<HotelType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  type: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  adultCapacity: { type: Number, required: true },
  childCapacity: { type: Number, required: true },
  imageUrls: [{ type: String, required: true }],
  facilities: [{ type: String, required: true }],
  starRating: { type: Number, required: true, min: 1, max: 5 },
  lastUpdated: { type: Date, required: true },
  bookings: [bookingSchema],
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
export default Hotel;
