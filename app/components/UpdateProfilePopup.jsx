"use client";

import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import EducationForm from "./EducationForm";
import { MdDelete } from "react-icons/md";

const UpdateProfilePopup = ({ show, setShowProfilePop, type, update }) => {
  const [editorText, setEditorText] = useState("");
  const [addSkill, setAddSkill] = useState("");
  const [addLanguage, setAddLanguage] = useState("");

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
  const skills = [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React.js",
    "Vue.js",
    "Angular",
    "Sass",
    "Webpack",
    "Responsive Design",
    "AJAX",
    "RESTful APIs",
    "GraphQL",
    "Version Control (Git)",
    "Bootstrap",
    "Tailwind CSS",
    "Jest",
    "TypeScript",
    "Redux",
    "State Management",
  ];
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
                <div>
                  <button className="px-3 py-1 mt-3 duration-300 bg-red-600 hover:bg-red-700 rounded-full text-white">
                    Delete
                  </button>
                  <button
                    disabled={editorText === ""}
                    className={`px-3 py-1 mt-3 duration-300 ${
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
                />
              </div>
            )}
            {type === "Skills" && (
              <div className="p-4 flex flex-col items-end">
                <div className="h-96 overflow-auto w-full mb-6">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center my-3 p-3 hover:bg-slate-400 hover:text-white font-bold duration-300 rounded-md"
                    >
                      <span
                        key={index}
                        className="font-semibold opacity-80 text-md"
                      >
                        {skill}
                      </span>
                      <button className="text-red-500 text-3xl">
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-end items-end w-full">
                  <input
                    type="text"
                    name="skill"
                    value={addSkill}
                    onChange={(e) => setAddSkill(e.target.value)}
                    placeholder="add a skill"
                    className="w-full p-2 mb-3 rounded-md border border-solid border-blue-500 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    disabled={addSkill === ""}
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
            )}
            {type === "Languages" && (
              <div className="p-4 flex flex-col items-end">
                <div className="flex flex-col justify-end items-end w-full">
                  <input
                    type="text"
                    name="language"
                    value={addLanguage}
                    onChange={(e) => setAddLanguage(e.target.value)}
                    placeholder="add a language"
                    className="w-full p-2 mb-3 rounded-md border border-solid border-blue-500 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    disabled={addLanguage === ""}
                    className={`px-3 py-1 mt-3 duration-300 ${
                      addLanguage === ""
                        ? "text-black"
                        : "text-white bg-blue-600  rounded-full "
                    }`}
                  >
                    Add a language
                  </button>
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
