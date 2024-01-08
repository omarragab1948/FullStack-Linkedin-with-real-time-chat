"use client";

import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import EducationForm from "./EducationForm";
import { MdDelete } from "react-icons/md";
import {
  addAbout,
  addLanguage,
  addSkill,
  deleteAbout,
  deleteLanguage,
  deleteSkill,
} from "../services/apiHandler";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../rtk/authSlice";

const UpdateProfilePopup = ({ show, setShowProfilePop, type, update, id }) => {
  const user = useSelector((state) => state.auth.user?.user);

  const [editorText, setEditorText] = useState(user?.about);
  const [addSkills, setAddSkills] = useState("");
  const [addLanguages, setAddLanguages] = useState("");
  const [spinner, setSpinner] = useState(false);

  const dispatch = useDispatch();
  const handleDocumentClick = (e) => {
    // Check if the clicked element is not part of the menu
    if (show && e.target.closest(".menu-container") === null) {
      setShowProfilePop(false); // Fix this line to use setShow instead of setShowMenu
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

  const handleAddAbout = async () => {
    setSpinner(true);
    const formData = new FormData();
    formData.set("about", editorText);
    try {
      const res = await addAbout(formData);
      if (res.status === 200) {
        dispatch(login(res.data));
        setSpinner(false);
        setShowProfilePop(false);
      }
    } catch (e) {
      throw e;
    }
  };
  const handleAddSkill = async () => {
    setSpinner(true);
    const formData = new FormData();
    formData.set("skill", addSkills);
    try {
      const res = await addSkill(formData);
      if (res.status === 200) {
        dispatch(login(res.data));
        setSpinner(false);
        setShowProfilePop(false);
      }
    } catch (e) {
      throw e;
    }
  };
  const handleDeleteAbout = async () => {
    setSpinner(true);

    try {
      const res = await deleteAbout();
      if (res.status === 200) {
        dispatch(login(res.data));
        setSpinner(false);
        setShowProfilePop(false);
        setEditorText("");
      }
    } catch (e) {
      throw e;
    }
  };
  const handleDeleteSkill = async (id) => {
    setSpinner(true);

    try {
      const res = await deleteSkill(id);
      if (res.status === 200) {
        dispatch(login(res.data));
        setSpinner(false);
        setShowProfilePop(false);
        setEditorText("");
      }
    } catch (e) {
      throw e;
    }
  };
  const handleAddLanguage = async () => {
    setSpinner(true);
    const formData = new FormData();
    formData.set("language", addLanguages);
    try {
      const res = await addLanguage(formData);
      if (res.status === 200) {
        dispatch(login(res.data));
        setSpinner(false);
        setShowProfilePop(false);
      }
    } catch (e) {
      throw e;
    }
  };
  const handleDeleteLanguage = async (id) => {
    setSpinner(true);
    try {
      const res = await deleteLanguage(id);
      if (res.status === 200) {
        dispatch(login(res.data));
        setSpinner(false);
        setShowProfilePop(false);
        setEditorText("");
      }
    } catch (e) {
      throw e;
    }
  };
  return (
    <>
      {show && (
        <div className=" fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="menu-container bg-slate-200  flex-col justify-between rounded-lg overflow-hidden w-1/2 ">
            <div className="py-2 px-3 flex w-full  justify-start relative items-center">
              <span className="text-xl font-semibold">{type} </span>
              <button
                onClick={() => setShowProfilePop(false)}
                className="text-2xl absolute top-2 right-2"
              >
                <IoCloseSharp />
              </button>
            </div>
            {type === "About" && (
              <div className="p-4 flex flex-col items-end">
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about?"
                  className="p-2 w-full h-48 focus:border-none focus:outline-blue-500  bg-white"
                />
                <div className="flex items-center">
                  <div
                    className={`border-4 my-2 border-solid mr-4 ${
                      spinner ? "opacity-1" : "opacity-0"
                    } border-gray-400 border-t-blue-500  rounded-full w-10 h-10 animate-spin`}
                  ></div>
                  <button
                    onClick={handleDeleteAbout}
                    className="px-3 py-1 mt-3 duration-300 bg-red-600 hover:bg-red-700 rounded-full text-white"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleAddAbout}
                    disabled={editorText === ""}
                    className={`px-3 py-1 mt-3 ml-3 duration-300 ${
                      editorText === ""
                        ? "text-black"
                        : "text-white bg-blue-600  rounded-full "
                    }`}
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
            {type === "Education" && (
              <div className="p-4 flex flex-col items-end">
                <EducationForm
                  show={show}
                  setShow={setShowProfilePop}
                  update={update}
                  id={id}
                />
              </div>
            )}
            {type === "Skills" && (
              <div className="p-4 flex flex-col items-end">
                <div className="h-96 overflow-auto w-full mb-6">
                  {user?.skills?.map((skill, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center my-3 p-3 hover:bg-slate-400 hover:text-white font-bold duration-300 rounded-md"
                    >
                      <span
                        key={index}
                        className="font-semibold opacity-80 text-md"
                      >
                        {skill.skill}
                      </span>
                      <button
                        onClick={() => handleDeleteSkill(skill?._id)}
                        className="text-red-500 text-3xl"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-end items-end w-full">
                  <input
                    type="text"
                    name="skill"
                    value={addSkills}
                    onChange={(e) => setAddSkills(e.target.value)}
                    placeholder="add a skill"
                    className="w-full p-2 mb-3 rounded-md border border-solid border-blue-500 focus:outline-none focus:border-blue-600"
                  />
                  <div className="flex">
                    <div
                      className={`border-4 my-2 border-solid mr-4 ${
                        spinner ? "opacity-1" : "opacity-0"
                      } border-gray-400 border-t-blue-500  rounded-full w-8 h-8 animate-spin`}
                    ></div>
                    <button
                      onClick={handleAddSkill}
                      disabled={addSkills === ""}
                      className={`px-3 py-1 mt-3 duration-300 ${
                        addSkill === ""
                          ? "text-black"
                          : "text-white bg-blue-600  rounded-full "
                      }`}
                    >
                      Add a skill
                    </button>
                  </div>
                </div>
              </div>
            )}
            {type === "Languages" && (
              <div className="p-4 flex flex-col items-end">
                <div className="h-96 overflow-auto w-full mb-6">
                  {user?.languages?.map((language, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center my-3 p-3 hover:bg-slate-400 hover:text-white font-bold duration-300 rounded-md"
                    >
                      <span
                        key={index}
                        className="font-semibold opacity-80 text-md"
                      >
                        {language.language}
                      </span>
                      <button
                        onClick={() => handleDeleteLanguage(language?._id)}
                        className="text-red-500 text-3xl"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-end items-end w-full">
                  <input
                    type="text"
                    name="language"
                    value={addLanguages}
                    onChange={(e) => setAddLanguages(e.target.value)}
                    placeholder="add a language"
                    className="w-full p-2 mb-3 rounded-md border border-solid border-blue-500 focus:outline-none focus:border-blue-600"
                  />
                  <div className="flex items-center">
                    <div
                      className={`border-4 my-2 border-solid mr-4 ${
                        spinner ? "opacity-1" : "opacity-0"
                      } border-gray-400 border-t-blue-500  rounded-full w-8 h-8 animate-spin`}
                    ></div>
                    <button
                      onClick={handleAddLanguage}
                      disabled={addLanguages === ""}
                      className={`px-3 py-1 mt-3 duration-300 ${
                        addLanguages === ""
                          ? "text-black"
                          : "text-white bg-blue-600  rounded-full "
                      }`}
                    >
                      Add a language
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateProfilePopup;
