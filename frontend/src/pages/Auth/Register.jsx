import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      // call the backend
      const res = await register({ username, email, password }).unwrap();

      // res structure: { status, data, message }
      dispatch(setCredentials(res.data));
      toast.success(res.message || "User registered successfully");
      navigate(redirect);
    } catch (err) {
      console.error(err);
      // err.response?.data?.message or err.data.message based on RTK Query
      toast.error(err?.data?.message || err?.error || "Something went wrong");
    }
  };

  return (
    <section className="pl-[10rem] flex flex-wrap">
      <div className="mr-[4rem] mt-[5rem]">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>

        <form onSubmit={submitHandler} className="container w-[40rem]">
          <div className="my-[2rem]">
            <label className="block text-sm font-medium text-white">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="mt-1 p-2 border rounded w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="my-[2rem]">
            <label className="block text-sm font-medium text-white">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              className="mt-1 p-2 border rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-[2rem]">
            <label className="block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="mt-1 p-2 border rounded w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="my-[2rem]">
            <label className="block text-sm font-medium text-white">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="mt-1 p-2 border rounded w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-4">
          <p className="text-white">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        alt="Register"
        className="h-[65rem] w-[59%] xl:block md:hidden sm:hidden rounded-lg"
      />
    </section>
  );
};

export default Register;
