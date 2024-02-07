import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../utils/api-clients";
import GuestInfoForm from "../form/GuestInfoForm/GuestInfoForm";

const Detail = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  console.log(hotelId, "hotelId");

  const { data: hotelData, isLoading } = useQuery(
    ["fetchHotelById", hotelId],
    async () => {
      if (hotelId) {
        return await apiClient.fetchHotelById(hotelId);
      }
    },
    {
      enabled: !!hotelId,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hotelData) {
    return <div>Hotel not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="text-2xl">
              ⭐
            </span>
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotelData.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
        {hotelData.imageUrls.map((image) => (
          <div className="h-[300px]">
            <img
              src={image}
              alt={hotelData.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 grid-cols-4 gap-2">
        {hotelData.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg_grid-cols-[2fr_1fr]">
            <div className="whitespace-pre-line">
                {/* {hotelData.description} */}

            </div>

            <div className="h-fit"> {/**h-fit makes this div match the height of the div that is in the column next to it */}
                <GuestInfoForm pricePerNight={hotelData.pricePerNight} hotelId={hotelData._id}/>
            </div>
      </div>
    </div>
  );
};

export default Detail;
