import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const ImageSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue
  } = useFormContext<HotelFormData>();

  const existingImageUrls = watch("imageUrls");

  const handleDelete = (event:React.MouseEvent<HTMLButtonElement>, imageUrl:string) => {
    event.preventDefault();
    console.log('delete',imageUrl);
    const newImageUrls = existingImageUrls?.filter((url) => url !== imageUrl);
    setValue("imageUrls",newImageUrls);
  }


  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls &&
          existingImageUrls.map((imageUrl, index) => (
            <div className="relative group" key={index}>
              <img src={imageUrl} className="min-h-full object-cover" />
              <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white" onClick={(event) => handleDelete(event,imageUrl)}>
                Delete
              </button>
            </div>
          ))}
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const len = imageFiles.length + (existingImageUrls?.length || 0)
              if (len === 0) {
                return "At least one image should be added";
              } else if (len > 6) {
                return "Maximum 6 images are allowed";
              } else {
                return true;
              }
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImageSection;
