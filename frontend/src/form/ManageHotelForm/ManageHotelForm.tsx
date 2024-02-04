import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImageSection from "./ImageSection";
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
  adultCapacity: number;
  childCapacity: number;
};

type ManageHotelFormProps = {
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading }: ManageHotelFormProps) => {
  const formMethods = useForm<HotelFormData>();
  //we are not gonna destruct the formMethods object here

  const { handleSubmit } = formMethods;

  const onSubmit = handleSubmit((data: HotelFormData) => {
    //We are going to send the data to the server, but first we need to convert the data to FormData can not send it as a JSON object
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("pricePerNight", data.pricePerNight.toString());
    formData.append("starRating", data.starRating.toString());
    formData.append("adultCapacity", data.adultCapacity.toString());
    formData.append("childCapacity", data.childCapacity.toString());
    data.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });
    Array.from(data.imageFiles).forEach((imageFile) => {
      formData.append("imageFiles", imageFile);
    });
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
