import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImageSection from "./ImageSection";
import { HotelType } from "../../../../backend/src/models/hotel";
import { useEffect } from "react";
export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCapacity: number;
  childCapacity: number;
};

type ManageHotelFormProps = {
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
  hotelData?: HotelType;
};

const ManageHotelForm = ({ onSave, isLoading,hotelData }: ManageHotelFormProps) => {
  const formMethods = useForm<HotelFormData>();
  //we are not gonna destruct the formMethods object here

  const { handleSubmit,reset } = formMethods;

  useEffect (()=>{
    if(hotelData){
      reset(hotelData)
    }
  },[hotelData,reset])

  const onSubmit = handleSubmit((data: HotelFormData) => {
    //We are going to send the data to the server, but first we need to convert the data to FormData can not send it as a JSON object
    console.log(data);
    const formData = new FormData();
    if(hotelData){
      console.log(hotelData._id, "hotelData._id")
      formData.append("_id", hotelData._id);
    }
    formData.append("name", data.name);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("pricePerNight", data.pricePerNight.toString());
    formData.append("starRating", data.starRating.toString());
    formData.append("adultCapacity", data.adultCapacity.toString());
    formData.append("childCapacity", data.childCapacity.toString());
    for (let i = 0; i < data.facilities.length; i++) {
      formData.append("facilities", data.facilities[i]);
    }

    //if form is in edit mode, then save the existing image urls in the form data so that they can also be saved in the backend
    if(data.imageUrls){
      console.log(data.imageUrls[0])
      for (let i = 0; i < data.imageUrls.length; i++) {
        formData.append("imageUrls", data.imageUrls[i]);
      }
    }

    Array.from(data.imageFiles).forEach((imageFile) => {
      formData.append("imageFiles", imageFile);
    });
    console.log(...formData);
    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImageSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
