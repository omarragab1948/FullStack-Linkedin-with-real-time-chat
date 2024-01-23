"use client";
import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBackgroundImage,
  deleteProfileImage,
  updateUserImages,
} from "../services/apiHandler";
import { login } from "../rtk/authSlice";
import userImage from "../../public/images/user.svg";
import Image from "next/image";

const UpdateImagePopup = ({ updateImage, setUpdateImage, typeImage }) => {
  const handleDocumentClick = (e) => {
    // Check if the clicked element is not part of the menu
    if (updateImage && e.target.closest(".menu-container") === null) {
      setUpdateImage(false); // Fix this line to use setShow instead of setShowMenu
      setSrcImage(false); //
      setImageShow(false); // Fix this line to use setImageShow instead of set
      setImgUrl(false); // Fix this line to use set
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener("click", handleDocumentClick);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [updateImage]);

  // ... (rest of your component code)

  const [spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  const [srcImage, setSrcImage] = useState(null);
  const [imageShow, setImageShow] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const user = useSelector((state) => state.auth?.user?.user);
  function handleImage(e) {
    const file = e.target.files[0];
    setSrcImage(file);

    const reader = new FileReader();
    reader.addEventListener("load", function (event) {
      const imageUrl = event.target.result;
      setImgUrl(imageUrl);
    });
    reader.readAsDataURL(file);
  }

  const reset = () => {
    setSrcImage(null);
    setImageShow(false);
    setImgUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    const formData = new FormData();
    if (srcImage) {
      if (typeImage === "Background photo") {
        formData.set("backgroundImage", srcImage);
        const res = await updateUserImages(formData);
        if (res.status === 200) {
          dispatch(login(res.data));
          typeof window !== "undefined" &&
            localStorage.setItem("user", JSON.stringify(res.data));
          setSpinner(false);
          setUpdateImage(false);
          reset();
        }
      } else {
        formData.set("profileImage", srcImage);

        const res = await updateUserImages(formData);

        if (res.status === 200) {
          dispatch(login(res.data));
          typeof window !== "undefined" &&
            localStorage.setItem("user", JSON.stringify(res.data));
          setSpinner(false);
          setUpdateImage(false);
          reset();
        }
      }
    }
  };
  const handleDelete = async () => {
    setSpinner(true);

    if (typeImage === "Profile photo") {
      try {
        const res = await deleteProfileImage();
        if (res.status === 200) {
          dispatch(login(res.data));
          typeof window !== "undefined" &&
            localStorage.setItem("user", JSON.stringify(res.data));
          setSpinner(false);
          setUpdateImage(false);
          reset();
        }
      } catch (e) {
        throw e;
      }
    } else {
      try {
        const res = await deleteBackgroundImage();
        if (res.status === 200) {
          dispatch(login(res.data));
          typeof window !== "undefined" &&
            localStorage.setItem("user", JSON.stringify(res.data));
          setSpinner(false);
          setUpdateImage(false);
          reset();
        }
      } catch (e) {
        throw e;
      }
    }
  };
  return (
    <>
      {updateImage && (
        <div className=" fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="menu-container dark:bg-darkbg bg-slate-200 flex flex-col justify-between rounded-lg overflow-hidden w-11/12 md:w-1/2 h-4/5">
            <div className="py-2 px-3 flex w-full  justify-start relative items-center">
              <span className="text-xl font-semibold dark:text-darkmaintext">
                {typeImage}{" "}
              </span>
              <button
                onClick={() => setUpdateImage(false)}
                className="text-2xl absolute top-2 right-2 dark:text-darkmaintext"
              >
                <IoCloseSharp />
              </button>
            </div>
            <div className="my-2 w-full text-center font-bold mx-auto">
              {imgUrl ? (
                <div className=" px-3 ">
                  <Image
                    src={`${imgUrl}`}
                    alt="typeImage"
                    width={1500}
                    height={1500}
                    className={`${
                      typeImage === "Background photo"
                        ? "w-full"
                        : "w-64 rounded-full"
                    } mx-auto  h-64 `}
                  />
                </div>
              ) : (
                <div className=" px-3 ">
                  <Image
                    src={
                      typeImage === "Background photo"
                        ? user?.backgroundImage || userImage
                        : user?.profileImage || userImage
                    }
                    width={1500}
                    height={1500}
                    alt={`${typeImage}`}
                    className={`${
                      typeImage === "Background photo"
                        ? "w-full"
                        : "w-64 rounded-full"
                    } mx-auto  h-64 `}
                  />
                </div>
              )}
            </div>
            <div
              className={`border-4 my-2 border-solid mx-auto ${
                spinner ? "opacity-1" : "opacity-0"
              } border-gray-400 border-t-blue-500  rounded-full w-10 h-10 animate-spin`}
            ></div>
            <div className="flex overflow-auto justify-between flex-col pb-2 pr-3 ">
              <div className="flex items-center justify-between ">
                <div className="flex ml-4">
                  <button
                    className="action p-1 w-12"
                    onClick={() => setImageShow(true)}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="file"
                      className="hidden"
                      onChange={handleImage}
                    />
                    <p className="my-2">
                      <label
                        htmlFor="file"
                        className=" text-white p-2 rounded cursor-pointer"
                      >
                        <img
                          src="/images/share-image.svg"
                          alt=""
                          className="w-full"
                        />
                      </label>
                    </p>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleDelete}
                    className="px-4 py-1 bg-red-600 text-white hover:bg-red-700 duration-300 rounded-full"
                  >
                    Delete
                  </button>
                  <button
                    disabled={!srcImage}
                    className={`py-1 rounded-full px-4 mx-2 font-bold ${
                      !srcImage
                        ? "dark:text-darkmaintext"
                        : "bg-blue-600 text-white "
                    }`}
                    type="button"
                    onClick={handleSubmit}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateImagePopup;
