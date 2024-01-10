"use client";
import React, { useState } from "react";
import logo from "/public/images/login-logo.svg";
import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";
import { signIn, signUp } from "../services/apiHandler";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "../rtk/authSlice";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";

const SignIn = () => {
  const [spinner, setSpinner] = useState(false);

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [er, setEr] = useState({
    email: false,
    password: false,
  });
  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{8,}$/;
  const dispatch = useDispatch();
  const handleInput = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleSignIn = async (e) => {
    setSpinner(true);

    e.preventDefault();
    setEr({
      email: "",
      password: "",
    });
    // Validate email
    if (!emailRegex.test(userInfo.email)) {
      setEr((prev) => ({ ...prev, email: true }));
      return;
    }

    // Validate password
    if (!passwordRegex.test(userInfo.password)) {
      setEr((prev) => ({
        ...prev,
        password: true,
      }));
      return;
    }
    try {
      const res = await signIn(userInfo);
      if (res.status === 200) {
        console.log(res.data);
        dispatch(login(res.data));
        setSpinner(false);

        localStorage.setItem("user", JSON.stringify(res.data));
        router.push("/home");
      } else {
        toast.error(res.error);
        setSpinner(false);
      }
      console.log(res);
    } catch (e) {}
  };

  const handleGoogle = () => {
    setSpinner(true);

    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        const userData = {
          firstName: user.displayName,
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
    <div className="pt-8 d-flex flex-column justify-content-center h-screen bg-white">
      <ToastContainer />
      <Link href="/" className="logo flex my-0 mx-auto w-1/4 md:w-1/6">
        <img src={logo} alt="" />
      </Link>
      <div className="shadow-md shadow-slate-400 flex rounded-md flex-col w-4/5 sm:w-1/2 md:w-2/5 lg:w-1/4 mx-auto p-3 pt-4 mt-8">
        <div>
          <h2 className="mx-auto text-black font-semibold text-3xl">Sign in</h2>
        </div>
        <form className="flex flex-col justify-center w-full mx-auto mt-3">
          <input
            type="email"
            name="email"
            className="bg-white text-black mt-3 py-3 px-2 rounded-md border-1 border border-solid border-slate-400"
            placeholder="Email"
            onChange={handleInput}
            onFocus={() => setEr((prev) => ({ ...prev, email: "" }))}
          />
          <span
            className={`text-red-500 opacity-0 duration-300 ${
              er.email && "opacity-100"
            }`}
          >
            Invalid email format
          </span>

          <input
            type="password"
            name="password"
            className="  text-black border border-solid border-slate-400 bg-white my-2 py-3 px-2 rounded-md border-1 "
            placeholder="Password"
            onChange={handleInput}
            onFocus={() => setEr((prev) => ({ ...prev, password: "" }))}
          />
          <span
            className={`text-red-500 opacity-0 duration-300 ${
              er.password && "opacity-100"
            }`}
          >
            Password must be at least 8 characters
          </span>
          <label className="text-sky-600 text-md mt-2">Forgot password?</label>
          <button
            onClick={handleSignIn}
            className="bg-blue-500 hover:bg-blue-700 duration-300 w-full h-12 my-4 font-medium text-white rounded-full"
          >
            Sign In
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
          className={`border-4 my-1 border-solid mx-auto  ${
            spinner ? "opacity-1" : "opacity-0"
          } border-gray-400 border-t-blue-500 rounded-full w-8 h-8 animate-spin`}
        ></div>
        <div className="flex justify-center">
          <p className="text-black my-1">
            New to LinkedIn?
            <Link href="/signup" className="text-blue-500 mx-1">
              Join now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
