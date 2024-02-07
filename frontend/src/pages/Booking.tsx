import * as apiClient from "../utils/api-clients";
import { useQuery } from "react-query";
import BookingForm from "../form/BookingForm/BookingForm";
import { useSearchContext } from "../context/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
const Booking = () => {
  const search = useSearchContext();
  const { hotelId } = useParams<{ hotelId: string }>();

  const [noNights, setNoNights] = useState<number>(0);

  useEffect (() => {
    if(search.checkIn && search.checkOut){
      const nights = Math.abs((search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24));
      setNoNights(Math.ceil(nights))
    }
  },[search.checkIn,search.checkOut]) //anytime the global values of checkIn and checkOut changes, we want to recalculate the number of nights

  const { data: hotelData, isLoading } = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId as string),
    { enabled: !!hotelId }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
   apiClient.fetchCurrentUser
  );
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if(!hotelData){
    return <div>Hotel not found</div>
  }
  if(!currentUser){
    return <div>Please login to book</div>
  }
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary checkIn={search.checkIn} checkOut={search.checkOut} adultCapacity={search.adults} childrenCapacity={search.child} noNights={noNights} hotel={hotelData}/>
      <BookingForm currentUser={currentUser} />
    </div>
  );
};


export default Booking;
