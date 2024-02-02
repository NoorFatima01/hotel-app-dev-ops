import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../utils/api-clients";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};



const Register = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const queryClient = useQueryClient();

  const navigate = useNavigate();


const successToast = () => toast.success('Account created successfully', { position: 'top-right' });
    const errorToast = () => toast.error('Error creating account',{position: 'top-right'});

  const mutation = useMutation(apiClient.register,{
    onSuccess: async ()=>{
      await queryClient.invalidateQueries('validateToken');
        successToast();
        navigate('/');
    },
    onError:(error)=>{ //this is where we are catching the error if thrown from the api
        errorToast();
        console.log(error)
    }
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    return mutation.mutate(data);
  });
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>

      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "This field is requried" })}
          />
          {errors.firstName && (<span className="text-red-500 text-sm">{errors.firstName.message}</span>)}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input className="border rounded w-full py-1 px-2 font-normal"
          {...register("lastName", { required: "This field is requried" })} />
          {errors.lastName && (<span className="text-red-500 text-sm">{errors.lastName.message}</span>)}
        </label>
      </div>

      <label className="text-gray-700 text-sm font-bold">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is requried" })}
        />
        {errors.email && (<span className="text-red-500 text-sm">{errors.email.message}</span>)}
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
        {errors.password && (<span className="text-red-500 text-sm">{errors.password.message}</span>)}
      </label>

      <label className="text-gray-700 text-sm font-bold">
        Confirm Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate: (value) => {
              if (!value) {
                return "This field is required";
              } else if (watch("password") !== value) {
                return "Passwords do not match";
              }
            },
          })}
        />
        {errors.confirmPassword && (<span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>)}
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500"
      >
        Create Account
      </button>
    </form>
  );
};

export default Register;
