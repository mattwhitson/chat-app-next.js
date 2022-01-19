import { useRouter } from "next/router";
import { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserContext } from "../../contexts/UserContext";
import userService from "../../services/userService";
import Cookies from "js-cookie";
import Error from "../../components/Error";
import Link from "next/link";

const Login = () => {
  const [error, setError] = useState(null);
  const [user, setUser] = useContext(UserContext);
  const router = useRouter();

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);

  const { errors } = formState;

  const onSubmit = async (user) => {
    userService
      .login(user)
      .then((response) => {
        Cookies.set("user", JSON.stringify(response.data));
        setUser(response.data);
        router.push("/");
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
    <div className="flex flex-col justify-center items-center h-full w-full">
      {error && <Error error={error} />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-96 px-12 pb-12 rounded sm:bg-[#f7f7f7] sm:shadow-xl"
      >
        <h3 className="text-2xl text-center mb-12 mt-6 font-semibold text-white sm:text-black">
          Matt's Messenger
        </h3>
        <div className="flex flex-col mb-4">
          <input
            {...register("username")}
            className="focus:outline-none rounded h-8 pl-1"
            placeholder="Username"
          />
          {errors.username && (
            <label className="text-sm text-red-500">
              {errors.username.message}
            </label>
          )}
        </div>
        <div className="flex flex-col mb-8">
          <input
            {...register("password")}
            className="focus:outline-none rounded h-8 pl-1"
            placeholder="Password"
            type="password"
          />
          {errors.password && (
            <label className="text-sm text-red-500">
              {errors.password.message}
            </label>
          )}
        </div>
        <button
          type="submit"
          className="py-2 px-4 rounded bg-blue-700 mb-4 text-white"
        >
          Login
        </button>

        <p className="text-sm text-center horizontal-lines text-white sm:text-black">
          OR
        </p>

        <Link href="/account/register" passHref>
          <button className="py-2 px-4 rounded bg-blue-700 mb-4 text-white mt-6">
            Register
          </button>
        </Link>
      </form>
    </div>
  );
};

export default Login;
