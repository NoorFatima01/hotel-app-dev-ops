import { HotelType } from "../../../backend/src/models/hotel";

type BookingDetailsSummaryProps = {
  checkIn: Date;
  checkOut: Date;
  adultCapacity: number;
  childrenCapacity: number;
  noNights: number;
  hotel: HotelType;
};

const BookingDetailsSummary = ({
  checkIn,
  checkOut,
  adultCapacity,
  childrenCapacity,
  noNights,
  hotel,
}: BookingDetailsSummaryProps) => {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div className="border-b py-2">
        Location:{" "}
        <div className="font-bold">{`${hotel.name},${hotel.city},${hotel.country}`}</div>
        <div className="flex justify-between">
          <div>
            Check-in
            <div className="font-bold">{checkIn.toDateString()}</div>
          </div>
          <div>
            Check-out
            <div className="font-bold">{checkOut.toDateString()}</div>
          </div>
        </div>
        <div className="border-t border-b py-2">
          Number of nights: <div className="font-bold">{noNights}</div>
        </div>
        <div>
          Number of guests:
          <div className="font-bold">
            {adultCapacity} adults + {childrenCapacity} children
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsSummary;
