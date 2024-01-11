"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import userImage from "../../../public/images/user.svg";
import Link from "next/link";
import PostModel from "@/app/components/PostModel";
import UpdateImagePopup from "@/app/components/UpdateImagesPopup";
import { FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";
import UpdateProfilePopup from "@/app/components/UpdateProfilePopup";
import { getAllUsers } from "@/app/services/apiHandler";

const page = () => {
  const [show, setShow] = useState(false);
  const [showProfilePop, setShowProfilePop] = useState(false);
  const [typeUpdate, setTypeUpdate] = useState("");
  const [updateImage, setUpdateImage] = useState(false);
  const [typeImage, setTypeImage] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const user = useSelector((state) => state.auth.user?.user);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleUpdateContent = (content) => {
    setShowProfilePop(true);
    setTypeUpdate(content);
  };
  const handleUpdateImage = (type) => {
    setUpdateImage(true);
    setTypeImage(type);
  };
  const comments = [
    { content: "yasda", postId: 1 },
    { content: "jgjk", postId: 2 },
    { content: "afaf", postId: 3 },
    { content: "afaf", postId: 3 },
  ];

  const [users, setUsers] = useState([]);
  const handleGetUsers = async () => {
    try {
      const res = await getAllUsers();
      if (res.status === 200) {
        setUsers(res.data);
      }
    } catch (err) {
      throw err;
    }
  };
  useEffect(() => {
    handleGetUsers();
  }, []);
  console.log(users);
  function formatTimestamp(timestampString) {
    const timestampDate = new Date(timestampString);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = timestampDate.toLocaleDateString(undefined, options);

    return formattedDate;
  }
  return (
    <div className="flex-col flex justify-center md:flex-row mt-10 px-10 md:pl-[140px] md:pr-[170px]">
      <div className="w-full md:w-[70%] mt-10 mr-4 ">
        {/* <div className="text-center w-full h-96 pb-2 relative rounded-t-xl border border-solid border-slate-300">
          <button
            onClick={() => handleUpdateImage("Background photo")}
            className="absolute top-4 right-5 bg-white rounded-full p-2"
          >
            <FaPen />
          </button>
          <div className="w-full rounded-t-md">
            {user?.backgroundImage !== "" ? (
              <Image
                src={user?.backgroundImage}
                alt="user"
                width={3500}
                height={3500}
                className="rounded-t-xl w-full h-56 mx-auto"
              />
            ) : (
              <div className="rounded-t-xl w-full h-64 mx-auto bg-gradient-to-b from-slate-400 to-slate-50"></div>
            )}
          </div>

          <button
            onClick={() => handleUpdateImage("Profile photo")}
            className="absolute top-[139px] md:top-[108px] left-12 rounded-full "
          >
            {user?.profileImage !== "" ? (
              <Image
                src={user?.profileImage}
                alt="user"
                className="rounded-full w-32 h-32 md:w-40 md:h-40"
                width={1500}
                height={1500}
              />
            ) : (
              <Image
                src={userImage}
                alt="user"
                className="rounded-full w-40 h-40"
                width={1500}
                height={1500}
              />
            )}
          </button>
          <UpdateImagePopup
            setUpdateImage={setUpdateImage}
            updateImage={updateImage}
            typeImage={typeImage}
          />
          <div className="flex flex-col justify-start items-start absolute top-11">
            <div className="font-semibold flex absolute top-11 left-14 text-xl leading-normal text-black  opacity-90">
              <span>
                {user?.firstName} {user?.lastName}
              </span>
            </div>

            <div className="font-normal flex absolute top-11 left-14 text-lg leading-snug mt-1">
              Front-End
            </div>
            <div className="flex top-11 absolute left-14">
              <span className="opacity-70">Alexandria</span>
              <span className="mx-3 opacity-70">Egypt</span>
              <button href="" className="text-blue-600 font-semibold">
                Contact info
              </button>
            </div>
            <div className="flex top-11  absolute left-14">
              <button href="" className="text-blue-600 font-semibold">
                {user?.connections || 0} Connections
              </button>
            </div>
          </div>
        </div> */}
        <div className="relative border border-solid border-slate-300 rounded-t-xl h-96 pb-2">
          {/* Background Image */}
          <div className="w-full h-56 rounded-t-xl">
            {user?.backgroundImage ? (
              <Image
                src={user?.backgroundImage}
                alt="user"
                width={1500}
                height={1500}
                className="w-full h-full  rounded-t-xl"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-slate-400 to-slate-50 rounded-t-xl"></div>
            )}
          </div>

          {/* Profile Image */}
          <button
            onClick={() => handleUpdateImage("Profile photo")}
            className="absolute bottom-28 left-10 rounded-full overflow-hidden"
          >
            {user?.profileImage !== "" ? (
              <Image
                src={user?.profileImage}
                alt="user"
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full"
                width={2500}
                height={2500}
              />
            ) : (
              <Image
                src={userImage}
                alt="user"
                className="w-24 h-24 object-cover rounded-full"
                width={1500}
                height={1500}
              />
            )}
          </button>

          {/* Edit Background Photo Button */}
          <button
            onClick={() => handleUpdateImage("Background photo")}
            className="absolute top-2 right-2 bg-white rounded-full p-2"
          >
            <FaPen />
          </button>

          {/* User Information */}
          <div className="absolute bottom-2 left-8 ">
            <div className="font-semibold text-xl leading-normal">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="font-normal text-lg leading-snug mt-1">
              Front-End
            </div>
            <div className="flex items-center">
              <span className="opacity-70">Alexandria</span>
              <span className="mx-3 opacity-70">Egypt</span>
              <a href="#" className="text-blue-600 font-semibold">
                Contact info
              </a>
            </div>
            <div>
              <a href="#" className="text-blue-600 font-semibold">
                {user?.connections || 0} Connections
              </a>
            </div>
          </div>

          {/* Update Image Popup */}
          <UpdateImagePopup
            setUpdateImage={setUpdateImage}
            updateImage={updateImage}
            typeImage={typeImage}
          />
        </div>

        <div className="my-4 p-4 border border-solid border-slate-300">
          <Link href="/home/network" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              data-supported-dps="24x24"
              fill="currentColor"
              class="mercado-match"
              width="24"
              height="24"
              focusable="false"
              className="text-xl opacity-70"
            >
              <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
            </svg>
            <span className="ml-2 text-xl opacity-70">My Network</span>
          </Link>
        </div>
        <div className="my-4 p-4 relative border border-solid border-slate-300">
          <button
            onClick={() => handleUpdateContent("About")}
            className="absolute top-4 right-5 bg-white rounded-full p-2"
          >
            <FaPen />
          </button>
          <span className="mb-4 text-xl leading-normal text-black  opacity-90 font-semibold">
            About
          </span>
          <p className="w-1/2">{user?.about}</p>
        </div>
        <div className="flex flex-col relative border border-solid border-slate-300 mt-4 py-2">
          <button
            onClick={() => setShow(true)}
            className="absolute top-6 right-5 py-1 px-2 text-blue-600 font-semibold border border-solid border-blue-600 rounded-full"
          >
            Create a post
          </button>

          <div className="flex flex-col justify-start items-start p-4 ">
            <span className="mb-4 text-xl leading-normal text-black  opacity-90 font-semibold">
              Activity
            </span>
            <div className="flex flex-col">
              <div className="my-3">
                <span
                  onClick={() => handleTabClick("posts")}
                  className={`cursor-pointer duration-300 mr-4 px-5 py-2  rounded-full font-semibold ${
                    activeTab === "posts"
                      ? " bg-blue-500 text-white"
                      : "text-blue-500 border border-blue-500 "
                  }`}
                >
                  Posts
                </span>
                <span
                  onClick={() => handleTabClick("comments")}
                  className={`cursor-pointer duration-300 mr-4 px-5 py-2  rounded-full font-semibold ${
                    activeTab === "comments"
                      ? " bg-blue-500 text-white"
                      : "text-blue-500 border border-blue-500 "
                  }`}
                >
                  Comments
                </span>
              </div>
              <div>
                {activeTab === "comments" ? (
                  <div className="flex flex-col items-start justify-start h-42">
                    {comments.slice(0, 3).map((comment) => (
                      <button
                        onClick={() => console.log(comment.postId)}
                        className="flex items-start justify-center flex-col h-20 my-1"
                      >
                        <span className="text-sm opacity-90">
                          Omar Mohamed commented on a post
                        </span>
                        <p>{comment.content}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    {user?.posts
                      .slice()
                      .reverse()
                      .slice(0, 3)
                      .map((post) => (
                        <button
                          onClick={() => console.log(post?._id)}
                          className="flex flex-col items-start h-20 my-1"
                        >
                          <div className="text-sm opacity-90">
                            <span className="mr-1">
                              {user?.firstName} {user?.lastName} posted this at
                            </span>
                            <span>{formatTimestamp(post.date)}</span>
                          </div>
                          <div className="flex items-center mt-2">
                            {post.image && (
                              <Image
                                src={post.image}
                                alt="post"
                                className="w-12 h-12 mr-2"
                                width={1500}
                                height={1500}
                              />
                            )}
                            <p className="text-sm font-semibold opacity-90">
                              {post.content}
                            </p>
                          </div>
                        </button>
                      ))}
                  </>
                )}
              </div>
            </div>
            <PostModel show={show} setShow={setShow} />
          </div>
          <Link href="" className="mx-auto text-lg  font-semibold opacity-70">
            Show all {activeTab}
          </Link>
        </div>
        <div className="my-4 p-4 relative border border-solid border-slate-300">
          <Link
            href="/home/profile/education"
            className="absolute top-4 right-5 bg-white rounded-full p-2"
          >
            <FaPen />
          </Link>
          <span className="mb-2 text-xl leading-normal text-black opacity-90 font-semibold">
            Education
          </span>
          <div className="flex items-start flex-col mt-4">
            {user?.education
              .slice()
              .reverse()
              .slice(0, 3)
              .map((ed, i) => (
                <div key={i} className="flex flex-col items-start ml-3">
                  <span className="font-semibold">{ed.institution}</span>
                  <span className="text-sm">{ed.department}</span>
                  <span className="text-sm opacity-70">
                    {ed.startDate} - {ed.endDate}
                  </span>
                  <span className="text-sm">Grade: {ed.grade}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="my-4 p-4 relative border border-solid border-slate-300">
          <button
            onClick={() => handleUpdateContent("Skills")}
            className="absolute top-4 right-5 bg-white rounded-full p-2"
          >
            <FaPen />
          </button>
          <span className="mb-2 text-xl leading-normal text-black opacity-90 font-semibold">
            Skills
          </span>
          <div className="flex items-start flex-col mt-4">
            {user?.skills?.slice(0, 3).map((skill, index) => (
              <span key={index} className="font-semibold opacity-80 text-md">
                {skill.skill}
              </span>
            ))}
          </div>
          {user?.skills?.length > 0 && (
            <button
              onClick={() => handleUpdateContent("Skills")}
              className="w-full text-lg flex justify-center font-semibold opacity-70 mt-3"
            >
              Show all skills
            </button>
          )}
        </div>
        <div className="my-4 p-4 relative border border-solid border-slate-300">
          <button
            onClick={() => handleUpdateContent("Languages")}
            className="absolute top-4 right-5 bg-white rounded-full p-2"
          >
            <FaPen />
          </button>
          <span className="mb-2 text-xl leading-normal text-black opacity-90 font-semibold">
            Languages
          </span>
          <div className="flex items-start flex-col mt-4">
            {user?.languages?.slice(0, 3).map((language, index) => (
              <span key={index} className="font-semibold opacity-80 text-md">
                {language.language}
              </span>
            ))}
          </div>
        </div>
      </div>
      <UpdateProfilePopup
        show={showProfilePop}
        setShowProfilePop={setShowProfilePop}
        type={typeUpdate}
      />
      <div className="w-full md:w-[30%] p-4 mt-10">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex  items-start justify-center w-full mb-4"
          >
            <Image
              src={user?.image || userImage}
              alt={user?.firstName}
              className="w-10 h-10 rounded-full mb-2"
              width={1500}
              height={1500}
            />
            <div className="flex flex-col w-4/5 ml-3 justify-start items-start">
              <p className="text-center text-gray-800 font-semibold text-sm">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-center text-gray-500 text-xs">{user?.title}</p>
              <button className="mt-3 py-1 px-5 border border-solid border-slate-800 hover:border-blue-500 hover:bg-blue-500 hover:text-white duration-300 rounded-full">
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
