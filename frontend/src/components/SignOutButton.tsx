import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../utils/api-clients";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const successToast = () =>
    toast.success("Signed out successfully", { position: "top-right" });
  const errorToast = () => toast.error("Error signing out", { position: "top-right" });

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken"); //when ever the user logs out, we want to invalidate the query that checks if the auth token exists and is valid or not and we want the useQuery to re run the query and re fetch the validation of the token
      successToast();
      navigate("/");
    },
    onError: () => {
      errorToast();
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
