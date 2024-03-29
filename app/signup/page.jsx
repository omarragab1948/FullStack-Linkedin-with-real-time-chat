"use client";
import React, { useEffect, useState } from "react";
import logo from "/public/images/login-logo.svg";
import Link from "next/link";
import { signIn, signUp } from "../services/apiHandler";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../rtk/authSlice";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import { useDispatch } from "react-redux";
const SignUp = () => {
  const dispatch = useDispatch();
  const [spinner, setSpinner] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [er, setEr] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{8,}$/;
  const handleInput = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setEr({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    });
  }, [userInfo]);
  const handleSignUp = async (e) => {
    e.preventDefault();

    setEr({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    });

    if (userInfo.firstName.trim() === "") {
      setEr((prev) => ({ ...prev, firstName: "First name cannot be empty" }));
    }

    if (userInfo.lastName.trim() === "") {
      setEr((prev) => ({ ...prev, lastName: "Last name cannot be empty" }));
    }

    if (!emailRegex.test(userInfo.email)) {
      setEr((prev) => ({ ...prev, email: "Invalid email format" }));
    }

    if (!passwordRegex.test(userInfo.password)) {
      setEr((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters long",
      }));
      return;
    }

    try {
      setSpinner(true);

      const res = await signUp(userInfo);

      if (res.status === 201) {
        router.push("/signin");
        setSpinner(false);
      } else {
        toast.error(res.error);
        setSpinner(false);
      }
    } catch (e) {
      setSpinner(false);

      throw e;
    }
  };
  const handleGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        setSpinner(true);

        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        const userData = {
          firstName: user.displayName.split(" ")[0],
          lastName: user.displayName.split(" ")[1],
          email: user.email,
          profileImage: user.photoURL,
          google: true,
        };
        if (user) {
          const res = await signIn(userData);
          if (res.status === 200) {
            dispatch(login(res.data));
            setSpinner(false);

            typeof window !== "undefined" &&
              localStorage.setItem("user", JSON.stringify(res.data));
            router.push("/home");
          }
        }
      })
      .catch((error) => {
        setSpinner(false);

        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };
  return (
    <div className="pt-8 d-flex flex-column justify-content-center h-screen ">
      <ToastContainer />

      <Link href="/" className="logo flex my-0 mx-auto w-1/4 md:w-1/6">
        <img src={logo} alt="" />
      </Link>
      <div className="signin-content shadow-slate-400 shadow-md flex rounded-md flex-col w-4/5 sm:w-1/2 md:w-2/5 lg:w-1/4 mx-auto p-3 pt-4 mt-8">
        <div>
          <h2 className="mx-auto text-black font-semibold text-3xl">Sign Up</h2>
        </div>
        <form className="flex flex-col justify-center w-full mx-auto mt-3 ">
          <input
            type="text"
            name="firstName"
            className=" mb-2 text-black border border-solid border-slate-400 bg-white my-2 py-3 px-2 rounded-md border-1 "
            placeholder="First Name"
            onChange={handleInput}
          />
          <span
            className={`text-red-500 opacity-0 duration-300 ${
              er.firstName && "opacity-100"
            }`}
          >
            {er?.firstName}
          </span>
          <input
            type="text"
            name="lastName"
            className=" mb-2 text-black border border-solid border-slate-400 bg-white my-2 py-3 px-2 rounded-md border-1 "
            placeholder="Last Name"
            onChange={handleInput}
          />
          <span
            className={`text-red-500 opacity-0 duration-300 ${
              er.lastName && "opacity-100"
            }`}
          >
            {er?.lastName}
          </span>
          <input
            type="email"
            name="email"
            className=" mb-2 text-black border border-solid border-slate-400 bg-white my-2 py-3 px-2 rounded-md border-1 "
            placeholder="Email"
            onChange={handleInput}
          />
          <span
            className={`text-red-500 opacity-0 duration-300 ${
              er.email && "opacity-100"
            }`}
          >
            {er?.email}
          </span>
          <input
            type="password"
            name="password"
            className=" mb-2 text-black border border-solid border-slate-400 bg-white my-2 py-3 px-2 rounded-md border-1 "
            placeholder="Password"
            onChange={handleInput}
          />
          <span
            className={`text-red-500 opacity-0 duration-300 ${
              er.password && "opacity-100"
            }`}
          >
            {er?.password}
          </span>
          <button
            onClick={handleSignUp}
            className="signin w-full h-12 my-4 font-medium text-white rounded-full bg-blue-500 hover:bg-blue-700 duration-300"
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={handleGoogle}
          className="bg-slate-200 flex font-bold my-3 border-1 border-solid border-gray-400 rounded-full mx-auto duration-300 w-full hover:bg-slate-300 text-gray-600 hover:text-black  h-10 items-center justify-center"
        >
          <img src="/images/google.svg" className="mr-2" alt="" />
          Sign in with Google
        </button>
        <div
          className={`border-4  border-solid mx-auto  ${
            spinner ? "opacity-1" : "opacity-0"
          } border-gray-400 border-t-blue-500 rounded-full w-8 h-8 animate-spin`}
        ></div>
        <div className="mt-3 text-center">
          <p className="text-gray-600">
            Already have an account?
            <Link href="/signin" className="text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
