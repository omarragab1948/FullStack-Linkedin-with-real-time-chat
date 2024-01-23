"use client";
import UpdateProfilePopup from "@/app/components/UpdateProfilePopup";
import { login } from "@/app/rtk/authSlice";
import { deleteEducation, getUserProfile } from "@/app/services/apiHandler";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const [showEducation, setShowEducation] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [typeUpdate, setTypeUpdate] = useState("");
  const [update, setUpdate] = useState("");
  const [spinner, setSpinner] = useState(false);

  const [id, setId] = useState("");
  const user = useSelector((state) => state.auth.user?.user);
  const [visitUser, setVisitUser] = useState(null);
  const pathname = usePathname();
  const idToVisit = pathname.split("/")[3];
  const handleGetUser = async () => {
    try {
      const res = await getUserProfile(idToVisit);

      if (res.status === 200) {
        setVisitUser(res.data.user);
      }
    } catch (err) {
      throw err;
    }
  };

  const sameUser = visitUser?._id === user?._id;
  useEffect(() => {
    handleGetUser();
  }, [pathname]);
  const dispatch = useDispatch();
  const handleUpdateContent = (content, type, eduId) => {
    setId(eduId);
    setShowEducation(true);
    setTypeUpdate(content);
    if (type === "add") {
      setUpdate("add");
    } else {
      setUpdate("update");
    }
  };
  const handleShowDelete = (eduId) => {
    setShowDelete(true);
    setId(eduId);
  };
  const handleDelete = async () => {
    setSpinner(true);
    try {
      const res = await deleteEducation(id);
      if (res.status === 200) {
        dispatch(login(res.data));
        setSpinner(false);
        setShowDelete(false);
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="mt-24 p-4 mx-auto rounded-md flex w-3/4 md:w-1/2 flex-col  dark:bg-darkbg justify-center items-center md:items-start">
      <Link
        href={`/home/profile/${sameUser ? user?._id : visitUser?._id}`}
        className="my-4 flex items-center dark:text-darkmaintext"
      >
        <FaArrowLeftLong className="mr-2 dark:text-darkmaintext" /> Back to
        profile
      </Link>

      <div className="my-4  p-4  flex flex-col border border-solid w-full  dark:border-darkborder border-slate-300">
        <div className="flex w-full items-center justify-between">
          <span className="mb-2 text-xl leading-normal text-black dark:text-darkmaintext opacity-90 font-semibold">
            Education
          </span>
          {sameUser && (
            <button
              onClick={() => handleUpdateContent("Education", "add")}
              className="text-xl"
            >
              <IoMdAdd className="text-3xl dark:text-darkmaintext" />
            </button>
          )}
        </div>
        <div className="flex w-full flex-col items-center mt-4">
          {user?.education
            .slice()
            .reverse()
            .map((e, i) => (
              <div
                key={i}
                className="flex  w-full my-4  dark:hover:bg-slate-600 hover:bg-slate-300 duration-300 p-3 rounded-md items-center justify-between ml-3"
              >
                <div className="flex flex-col dark:text-darksecondtext ">
                  <span className="font-semibold dark:text-darksecondtext ">
                    {e.institution}
                  </span>
                  <span className="text-sm dark:text-darksecondtext ">
                    {e.department}
                  </span>
                  <span className="text-sm opacity-70 dark:text-darksecondtext ">
                    {e.startDate} - {e.endDate}
                  </span>
                  <span className="text-sm dark:text-darksecondtext ">
                    Grade: {e.grade}
                  </span>
                </div>
                <div className="flex items-center flex-col justify-center">
                  <button
                    onClick={() =>
                      handleUpdateContent("Education", "update", e?._id)
                    }
                    className="text-xl dark:text-darksecondtext"
                  >
                    <FaPen />
                  </button>
                  <button
                    onClick={() => handleShowDelete(e?._id)}
                    className=" text-2xl text-red-500 mt-4"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {showDelete && (
        <div className=" fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="menu-container dark:bg-darkbg bg-slate-200 justify-center flex p-4 flex-col items-center rounded-lg overflow-hidden w-1/2 ">
            <div
              className={`border-4 my-2 border-solid mr-4 ${
                spinner ? "opacity-1" : "opacity-0"
              } border-gray-400 border-t-blue-500  rounded-full w-10 h-10 animate-spin`}
            ></div>
            <span className="dark:text-darkmaintext">
              Are you sure want to delete this.
            </span>
            <div className="mt-3">
              <button
                className="text-white py-2 px-4 rounded-md mr-2 bg-red-600 "
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className=" py-2 px-4 rounded-md font-semibold mr-2 bg-slate-300"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <UpdateProfilePopup
        show={showEducation}
        setShowProfilePop={setShowEducation}
        type={typeUpdate}
        update={update}
        id={id}
      />
    </div>
  );
};

export default page;
