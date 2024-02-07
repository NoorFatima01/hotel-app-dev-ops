import React, { createContext, useState } from "react";
type SearchContextType = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  child: number;
  hotelId: string;
  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adults: number,
    children: number,
    hotelId?: string
  ) => void;
};

type SearchContextProviderProps = {
  children: React.ReactNode;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: SearchContextProviderProps) => {
  const [destination, setDestination] = useState<string>(
    () => sessionStorage.getItem("destination") || ""
  );
  const [checkIn, setCheckIn] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
  );
  const [checkOut, setCheckOut] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
  );
  const [adults, setAdults] = useState<number>(() =>
    parseInt(sessionStorage.getItem("adults") || "1")
  );
  const [child, setChildren] = useState<number>(() =>
    parseInt(sessionStorage.getItem("children") || "0")
  );
  const [hotelId, setHotelId] = useState<string>(
    () => sessionStorage.getItem("hotelId") || ""
  );

  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adults: number,
    children: number,
    hotelId?: string
  ) => {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setAdults(adults);
    setChildren(children);
    if (hotelId) setHotelId(hotelId);
    sessionStorage.setItem("destination", destination);
    sessionStorage.setItem("checkIn", checkIn.toISOString());
    sessionStorage.setItem("checkOut", checkOut.toISOString());
    sessionStorage.setItem("adults", adults.toString());
    sessionStorage.setItem("children", children.toString());
    if (hotelId) sessionStorage.setItem("hotelId", hotelId || "");
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        adults,
        child,
        hotelId,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
