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

export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
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
