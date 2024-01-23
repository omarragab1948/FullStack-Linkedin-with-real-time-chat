"use client";

import { IoCloseSharp } from "react-icons/io5";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../rtk/authSlice";
import { changeContact } from "../services/apiHandler";

const UpdateContactPopup = ({ setShowUpdateContact, show }) => {
  const user = useSelector((state) => state.auth.user?.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    website: "",
    phone: "",
    emailToContact: "",
  });

  useEffect(() => {
    // Update formData when user data is available
    if (user) {
      setFormData({
        website: user.website,
        phone: user.phone,
        emailToContact: user.emailToContact,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const loginUser = async () => {
    try {
      await dispatch(login()).then((data) => {
        setUser(data.payload.user);
        typeof window !== "undefined" &&
          localStorage.setItem("user", JSON.stringify(data.payload));
      });
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  const handleSaveChanges = async () => {
    try {
      const res = await changeContact(formData);
      if (res.status === 200) {
        setTimeout(async () => {
          await loginUser();
        }, 1000);
      }
    } catch (err) {
      throw err;
    }

    setShowUpdateContact(false);
  };
  const handleClose = () => {
    setShowUpdateContact(false);
    setFormData({
      website: user.website,
      phone: user.phone,
      emailToContact: user.emailToContact,
    });
  };
  return (
    show && (
      <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="menu-container dark:bg-darkbg bg-slate-200 flex-col justify-between rounded-lg overflow-hidden w-11/12 sm:w-2/3 md:w-1/2">
          <div className="py-2 px-3 flex w-full justify-start relative items-center">
            <button
              onClick={handleClose}
              className="text-2xl absolute top-2 right-2 dark:text-darkmaintext"
            >
              <IoCloseSharp />
            </button>
          </div>

          {/* Input fields for first name, last name, title, country, and email */}
          <div className="p-4">
            <label className="block mb-2 text-sm font-semibold dark:text-darkmaintext">
              Website
            </label>
            <input
              type="text"
              name="website"
              className="w-full p-2 mb-4 border border-solid dark:text-darkmaintext border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-darkbg"
              value={formData.website}
              onChange={handleChange}
            />

            <label className="block mb-2 text-sm font-semibold  dark:text-darkmaintext">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              className="w-full p-2 mb-4 border border-solid dark:text-darkmaintext border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-darkbg"
              value={formData.phone}
              onChange={handleChange}
            />
            <label className="block mb-2 text-sm font-semibold dark:text-darkmaintext">
              Email
            </label>
            <input
              type="email"
              name="emailToContact"
              className="w-full p-2 mb-4 border border-solid dark:text-darkmaintext border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-darkbg"
              value={formData.emailToContact}
              onChange={handleChange}
            />

            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdateContactPopup;
