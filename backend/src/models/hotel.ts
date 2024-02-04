import mongoose from "mongoose";

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
};

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
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
export default Hotel;
