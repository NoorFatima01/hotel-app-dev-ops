import { Link } from "react-router-dom";
import * as apiClient from "../utils/api-clients";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { HotelType } from "../../../backend/src/models/hotel";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { data: hotelData, isLoading } = useQuery(
    "fetchHotels",
    apiClient.getMyHotels,
    {
      //the response from useQuery is always called data
      onError: (error) => {
        toast.error("Error fetching hotels", { position: "top-right" });
        console.log(error);
      },
    }
  );

  if (isLoading) return <p>Loading...</p>;

  if (!hotelData) return <p>No Hotels found</p>;

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-5">
        {hotelData?.map((hotel: HotelType) => (
          <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1 text-2xl" />
                {hotel.city}, {hotel.country}
              </div>

              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1 text-2xl" />
                {hotel.type}
              </div>

              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1 text-2xl" />
                {hotel.pricePerNight} / night
              </div>

              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiHotel className="mr-1 text-2xl" />
                {hotel.adultCapacity} adults, {hotel.childCapacity} children
              </div>

              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1 text-2xl" />
                {hotel.starRating} stars
              </div>
            </div>

            <span className="flex justify-end">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
