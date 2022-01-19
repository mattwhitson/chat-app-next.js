import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import userService from "../../services/userService";
import { useState } from "react";
import { useRouter } from "next/router";
import Error from "../../components/Error";

const Register = () => {
  const [error, setError] = useState(null);
  const router = useRouter();

  const validationSchema = yup.object({
    username: yup.string().min(2).required(),
    password: yup.string().min(4).required(),
    email: yup.string().required(),
    name: yup.string().min(2).required(),
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { errors } = formState;

  const registerUser = (newUser) => {
    userService
      .register(newUser)
      .then((response) => {
        console.log(response);
        router.push("/account/login");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setError(err.response.data.message);
        setTimeout(() => {
          setError(null);
        }, 5000);
      });
  };
  return (
    <div className="relative flex items-center justify-center h-[calc(100vh-5rem)] w-full ">
      {error && <Error error={error} />}
      <form
        onSubmit={handleSubmit(registerUser)}
        className="flex flex-col mb-12 w-96 px-16 pt-4 h-96 sm:h-[425px] sm:bg-[#f7f7f7] rounded-md"
      >
        <h4 className="text-white sm:text-black text-center font-semibold text-2xl pb-12">
          Register for Matt's Messenger!
        </h4>
        <div className="pb-4">
          <input
            className="focus:outline-none rounded pl-1 h-8 w-full"
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div className="pb-4">
          <input
            type="password"
            className="focus:outline-none rounded pl-1 h-8 w-full"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="pb-4">
          <input
            className="focus:outline-none rounded pl-1 h-8 w-full"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="pb-8">
          <input
            className="focus:outline-none rounded pl-1 h-8 w-full"
            placeholder="Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="rounded py-2 px-2 bg-blue-700 text-white"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
