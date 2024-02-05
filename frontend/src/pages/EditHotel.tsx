import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { toast } from "react-toastify";
import * as apiClient from "../utils/api-clients";
import ManageHotelForm from "../form/ManageHotelForm/ManageHotelForm";
const EditHotel = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id, "id");
  const { data: hotelData } = useQuery(
    "fetchHotel",
    () => apiClient.getMyHotelById(id || ""),
    {
      enabled: !!id,
      onError: () => {
        toast.error("Error fetching hotel", { position: "top-right" });
      },
    }
  );

  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      toast.success("Hotel edited successfully", { position: "top-right" });
    },
    onError: () => {
      toast.error("Error editing hotel", { position: "top-right" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return (
    <ManageHotelForm
      hotelData={hotelData}
      isLoading={isLoading}
      onSave={handleSave}
    />
  );
};

export default EditHotel;
