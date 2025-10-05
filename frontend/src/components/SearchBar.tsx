import { MdTravelExplore } from "react-icons/md";
import { useSearchContext } from "../context/SearchContext";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const search = useSearchContext();
  const navigate = useNavigate();

  //to prevent re rendering of the entire website, we use useState to store the search values bcz if we use the states in the context, the entire website will re render
  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adults, setAdults] = useState<number>(search.adults);
  const [children, setChildren] = useState<number>(search.child);
  // const [hotelId, setHotelId] = useState<string>(hotelId);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search.saveSearchValues(destination, checkIn, checkOut, adults, children);
    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
    >
      <div className="flex flex-row items-center flex-1 bg-white p-2">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full text-md focus:outline-none"
        />
      </div>

      <div className="flex bg-white px-2 py-1 gap-2">
        <label className="items-center flex">
          Adults:
          <input
            className="w-full p-1 focus:outline-none font-bold"
            type="number"
            min={1}
            max={20}
            value={adults}
            onChange={(event) => {
              setAdults(parseInt(event.target.value));
            }}
          />
        </label>
        <label className="items-center flex">
          Children:
          <input
            className="w-full p-1 focus:outline-none font-bold"
            type="number"
            min={0}
            max={10}
            value={children}
            onChange={(event) => {
              setChildren(parseInt(event.target.value));
            }}
          />
        </label>
      </div>

      <div>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          wrapperClassName="min-w-full"
          className="min-w-full bg-whit p-2 focus:outline-none"
        />
      </div>

      <div>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date)}
          selectsStart
          startDate={checkOut}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          wrapperClassName="min-w-full"
          className="min-w-full bg-whit p-2 focus:outline-none"
        />
      </div>
      <div className="flex gap-1 ">
        <button className="w-2/3 bg-[#2c1eaf] text-white h-full p-2 font-bold text-xl hover:bg-[#1e1eaf]">
          Search
        </button>
        <button className="w-1/3 bg-red-600 text-white h-full p-2 font-bold text-lg hover:bg-red-500">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
