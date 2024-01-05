"use client";
import Image from "next/image";
import user from "../../../public/images/user.svg";
import { useState } from "react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("notificationsForAll");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const notificationsForMyPosts = [
    {
      id: 1,
      imageUrl: user,
      content:
        "notificationsForMyPosts 1: Lorem ipsum dolor sit amet Notification 1: Lorem ipsum dolor sit amet..",
    },
    {
      id: 2,
      imageUrl: user,
      content:
        "notificationsForMyPosts 2: Consectetur adipiscing elit Notification 1: Lorem ipsum dolor sit amet..",
    },
  ];
  const notificationsForAll = [
    {
      id: 1,
      imageUrl: user,
      content:
        "notificationsForAll 1: Lorem ipsum dolor sit amet Notification 1: Lorem ipsum dolor sit amet..",
    },
    {
      id: 2,
      imageUrl: user,
      content:
        "notificationsForAll 2: Consectetur adipiscing elit Notification 1: Lorem ipsum dolor sit amet..",
    },
  ];
  return (
    <div className="container flex  mx-auto py-4 px-16 mt-20 ">
      <div className="w-1/5 flex flex-col border border-solid h-32 border-slate-300 py-2 px-3">
        <span className="font-semibold text-md">Manage your </span>
        <span className="font-semibold text-md">Notifications</span>
        <a
          className="text-blue-600 font-semibold"
          target="blank"
          href="https://www.google.com"
        >
          View Settings
        </a>
      </div>
      <div className="flex flex-col items-center justify-center w-3/5 ml-4">
        <div className="border border-solid rounded-lg border-slate-300 w-full p-3 mb-3">
          <button
            onClick={() => handleTabClick("notificationsForAll")}
            className={`cursor-pointer duration-300 mr-4 px-5 py-1  rounded-full font-semibold ${
              activeTab === "notificationsForAll"
                ? " bg-blue-500 text-white"
                : "text-blue-500 border border-blue-500 "
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleTabClick("notificationsForMyPosts")}
            className={`cursor-pointer duration-300 mr-4 px-5 py-1  rounded-full font-semibold ${
              activeTab === "notificationsForMyPosts"
                ? " bg-blue-500 text-white"
                : "text-blue-500 border border-blue-500 "
            }`}
          >
            My posts
          </button>
        </div>
        <div className="flex flex-col p-2 rounded-lg items-center justify-center w-full border border-solid border-slate-300">
          {activeTab === "notificationsForAll"
            ? notificationsForAll.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-start bg-white border p-2 mb-2 rounded-md shadow-md"
                >
                  {notification.imageUrl && (
                    <Image
                      src={notification.imageUrl}
                      alt="Notification"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  )}
                  <div>
                    <p className="text-gray-700">{notification.content}</p>
                  </div>
                </div>
              ))
            : notificationsForMyPosts.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-start bg-white border p-2 mb-2 rounded-md shadow-md"
                >
                  {notification.imageUrl && (
                    <Image
                      src={notification.imageUrl}
                      alt="Notification"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  )}
                  <div>
                    <p className="text-gray-700">{notification.content}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
