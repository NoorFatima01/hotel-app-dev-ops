import { HotelType } from "./hotel";

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentIntentResponse = {
  clientSecret: string;
  paymentIntentId: string;
  totalCost: number;
};

export type BookingType = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCapacity: number;
  childCapacity: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
}