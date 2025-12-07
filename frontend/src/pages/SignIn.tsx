import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../utils/api-clients";
import { toast } from "react-toastify";
import { useNavigate, Link, useLocation } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();

  const successToast = () =>
    toast.success("Sign in successfull", { position: "top-right" });
  const errorToast = () =>
    toast.error("Error with sign in", { position: "top-right" });

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken"); //update the query by rerunning the validateToken query
      successToast();
      navigate(location.state?.from?.pathname || "/");
    },
    onError: () => {
      errorToast();
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>

      <label className="text-gray-700 text-sm font-bold">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is requried" })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-bold">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is requried",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        />
          <span className="text-red-500 text-sm">
            {errors.password?.message}
          </span>
        
      </label>
      <span className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-[#2c1eaf] text-white p-2 font-bold hover:bg-[#1e1eaf]"
        >
          Log In
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-bold">
            Register
          </Link>
        </p>
      </span>
    </form>
  );
};

export default SignIn;
