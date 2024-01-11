"use client";
import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../services/apiHandler";
import { login } from "../rtk/authSlice";

const PostModel = ({ show, setShow, handlePostAdded }) => {
  const handleDocumentClick = (e) => {
    // Check if the clicked element is not part of the menu
    if (show && e.target.closest(".menu-container") === null) {
      setShow(false); // Fix this line to use setShow instead of setShowMenu
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener("click", handleDocumentClick);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [show]);

  // ... (rest of your component code)

  const [spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  const [editorText, setEditorText] = useState("");
  const [srcImage, setSrcImage] = useState(null);
  const [imageShow, setImageShow] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const user = useSelector((state) => state.auth.user?.user);

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
    setEditorText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    const formData = new FormData();
    formData.set("content", editorText);
    formData.set("image", srcImage);

    if (editorText || srcImage) {
      const res = await addPost(formData);
      console.log(res);
      if (res.status === 201) {
        console.log(res.posts);
        handlePostAdded();
        dispatch(login(res.data));
        setSpinner(false);
        setShow(false);
        reset();
      }
    }
  };

  return (
    <>
      {show && (
        <div className=" fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="menu-container bg-white flex flex-col justify-between rounded-lg overflow-hidden w-11/12 md:w-1/2 h-3/5 md:h-4/5">
            <div className="py-2 px-3 flex w-full flex-col justify-between relative items-center">
              <div className="flex items-center w-full mt-2">
                {user && user?.profileImage ? (
                  <img
                    src={user?.profileImage}
                    alt=""
                    className="rounded-full w-14 h-14 mr-2"
                  />
                ) : (
                  <img
                    src="/images/user.svg"
                    className="rounded-full w-14 h-14 mr-2"
                    alt=""
                  />
                )}
                <span className="font-semibold text-xl leading-6 ml-2">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={() => setShow(false)}
                className="text-2xl absolute top-2 right-2"
              >
                <IoCloseSharp />
              </button>
              <div className="py-2 px-3 h-full w-full">
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about?"
                  className="p-2 w-full h-48 focus:border-none focus:outline-none bg-white"
                />
              </div>
            </div>
            <div className="flex overflow-auto justify-between flex-col pb-2 pr-3 bg-f7f7f7">
              <div className="flex justify-around items-center">
                {imageShow && (
                  <div className="overflow-auto mx-auto px-3">
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
                        className="label-btn bg-sky-600 text-white p-2 rounded cursor-pointer"
                      >
                        Select {imgUrl ? "another" : "an"} image to share
                      </label>
                    </p>
                  </div>
                )}
              </div>
              <div className="my-2 w-full text-center font-bold mx-auto">
                {imgUrl && (
                  <div className="h-48 overflow-auto w-full px-3">
                    <img src={`${imgUrl}`} alt="" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between ">
                <div className="flex ml-3">
                  <button
                    className="action p-1 w-12"
                    onClick={() => setImageShow(true)}
                  >
                    <img
                      src="/images/share-image.svg"
                      alt=""
                      className="w-full"
                    />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div
                    className={`border-4 my-2 border-solid mr-3 ${
                      spinner ? "opacity-1" : "opacity-0"
                    } border-gray-400 border-t-blue-500 rounded-full w-8 h-8 animate-spin`}
                  ></div>
                  <button
                    disabled={!editorText && !srcImage}
                    className={`py-1 rounded-full px-4 mr-4 font-bold ${
                      !editorText && !srcImage ? "" : "bg-blue-500 text-white "
                    }`}
                    type="button"
                    onClick={handleSubmit}
                  >
                    Post
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

export default PostModel;
