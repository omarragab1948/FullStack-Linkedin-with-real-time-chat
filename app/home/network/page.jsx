"use client";
import React, { useEffect, useState } from "react";

import { connect, getAllUsers } from "@/app/services/apiHandler";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/app/rtk/authSlice";
import io from "socket.io-client";
import Recommendations from "@/app/components/Recommendations";
import Accepted from "@/app/components/Accepted";
import Pending from "@/app/components/Pending";

const Page = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.auth.user?.user);
  const status = useSelector((state) => state.auth.status);
  const [selectedTab, setSelectedTab] = useState("recommendations");

  useEffect(() => {
    const newSocket = io("https://linkedin-websockets.onrender.com", {
      query: { id: user?._id },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("connected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);
  const loginUser = async () => {
    try {
      await dispatch(login()).then((data) => {
        typeof window !== "undefined" &&
          localStorage.setItem("user", JSON.stringify(data.payload));
      });
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const sendConnectToSocket = async (item) => {
    if (socket !== null) {
      socket.emit("send connect", item, user);
      setTimeout(async () => {
        await loginUser();
      }, 1000);
    }
  };

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

  const sendConnectToServer = async (item) => {
    try {
      const res = await connect(item?._id);
    } catch (err) {
      throw err;
    }
  };

  const handleConnect = async (item) => {
    sendConnectToServer(item);
    sendConnectToSocket(item);
  };

  const filteredUsers = users.filter(
    (item) =>
      !user?.pendingConnections.some(
        (conn) =>
          conn?.receiverId === item?._id || conn?.requesterId === item?._id
      ) &&
      !user?.acceptedConnections.some(
        (conn) =>
          conn?.receiverId === item?._id || conn?.requesterId === item?._id
      )
  );
  if (status === "loading" || status === "idle") {
    return (
      <div className="w-full flex justify-center  dark:bg-black z-50 mt-80 items-center h-full absolute top-0 left-0 bg-white">
        <div
          className={`border-4 my-2 border-solid mr-3  border-gray-400 border-t-blue-500 rounded-full w-12 h-12 animate-spin`}
        ></div>
      </div>
    );
  }

  return (
    <div className="container flex flex-col  mx-auto py-4 px-16 mt-20 ">
      <div className="w-full flex dark:bg-darkbg  flex-col sm:flex-row justify-around  border border-solid dark:border-darkborder border-slate-300 py-4 px-3">
        <button
          onClick={() => setSelectedTab("recommendations")}
          className={`flex items-center justify-between font-extrabold  py-3 text-blue-600  ${
            selectedTab === "recommendations"
              ? "border-b opacity-100 border-blue-600 border-solid"
              : "opacity-70"
          }`}
        >
          <div className="flex items-center opacity-70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              data-supported-dps="24x24"
              fill="currentColor"
              className="mercado-match"
              width="24"
              height="24"
              focusable="false"
            >
              <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
            </svg>
            <span className="mr-2">Recommendations</span>
          </div>
          <span>{filteredUsers.length}</span>
        </button>
        <button
          onClick={() => setSelectedTab("connections")}
          className={`flex items-center justify-between font-extrabold  py-3 text-green-600  ${
            selectedTab === "connections"
              ? "border-b opacity-100 border-green-600 border-solid"
              : "opacity-70"
          }`}
        >
          <div className="flex items-center opacity-70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              data-supported-dps="24x24"
              fill="currentColor"
              className="mercado-match"
              width="24"
              height="24"
              focusable="false"
            >
              <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
            </svg>
            <span className="mr-2">Connections</span>
          </div>
          <span>{user?.acceptedConnections?.length}</span>
        </button>
        <button
          onClick={() => setSelectedTab("pending")}
          className={`flex items-center justify-between font-extrabold  py-3 text-orange-600  ${
            selectedTab === "pending"
              ? "border-b opacity-100 border-orange-600 border-solid"
              : "opacity-70"
          }`}
        >
          <div className="flex items-center opacity-70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              data-supported-dps="24x24"
              fill="currentColor"
              className="mercado-match"
              width="24"
              height="24"
              focusable="false"
            >
              <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
            </svg>
            <span className="mr-2 ">Pending</span>
          </div>
          <span>{user?.pendingConnections?.length}</span>
        </button>
      </div>

      <div className="flex dark:bg-darkbg dark:border-darkborder flex-wrap items-center justify-center my-4  w-full   border border-slate-300 border-solid py-3 px-8">
        {selectedTab === "recommendations" && (
          <Recommendations
            user={user}
            users={users}
            handleConnect={handleConnect}
          />
        )}
        {selectedTab === "connections" && (
          <Accepted user={user} handleConnect={handleConnect} />
        )}
        {selectedTab === "pending" && (
          <Pending user={user} handleConnect={handleConnect} />
        )}
      </div>
    </div>
  );
};

export default Page;
