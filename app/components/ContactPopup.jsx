"use client";

import { IoCloseSharp } from "react-icons/io5";

import { useState } from "react";
import { useSelector } from "react-redux";
import { FaPen } from "react-icons/fa";
import UpdateContactPopup from "./UpdateContactPopup";

const ContactPopup = ({ setShowContactPopup, show }) => {
  const user = useSelector((state) => state.auth.user?.user);
  const [showUpdateContact, setShowUpdateContact] = useState(false);
  const handleClose = () => {
    setShowContactPopup(false);
  };
  return (
    show && (
      <>
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="menu-container dark:bg-darkbg bg-slate-200 flex-col justify-between rounded-lg overflow-hidden w-11/12 sm:w-2/3 md:w-1/2">
            <div className="py-2 px-3 flex w-full justify-start relative items-center">
              <button
                onClick={handleClose}
                className="text-2xl absolute top-2 right-4 dark:text-darkmaintext"
              >
                <IoCloseSharp />
              </button>
              <button
                onClick={() => setShowUpdateContact(true)}
                className=" bg-white rounded-full p-2  text-2xl absolute top-16 right-2"
              >
                <FaPen />
              </button>
            </div>

            {/* Display user data as divs */}
            <div className="p-4">
              <div className="mb-4 flex flex-col">
                <span className="text-sm font-semibold dark:text-darkmaintext">
                  Website
                </span>
                <a
                  href={`${user?.website}`}
                  target="_blank"
                  className="text-md text-blue-600"
                >
                  {user?.website || ""}
                </a>
              </div>

              <div className="mb-4">
                <span className="text-sm font-semibold dark:text-darkmaintext">
                  Phone
                </span>
                <div className="text-md dark:text-darkmaintext">
                  {user?.phone || ""}
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm font-semibold dark:text-darkmaintext">
                  Email
                </span>
                <div className="text-md dark:text-darkmaintext">
                  {user?.emailToContact || ""}
                </div>
              </div>
            </div>
          </div>
        </div>
        <UpdateContactPopup
          show={showUpdateContact}
          setShowUpdateContact={setShowUpdateContact}
        />
      </>
    )
  );
};

export default ContactPopup;
