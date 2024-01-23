"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, getAllUsers } from "../services/apiHandler";
import Image from "next/image";
import userImage from "@/public/images/user.svg";
import Link from "next/link";

const RightSide = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const userr = useSelector((state) => state.auth.user?.user);

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
      socket.emit("send connect", item, userr);
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
      !userr?.pendingConnections.some(
        (conn) =>
          conn?.receiverId === item?._id || conn?.requesterId === item?._id
      ) &&
      !userr?.acceptedConnections.some(
        (conn) =>
          conn?.receiverId === item?._id || conn?.requesterId === item?._id
      )
  );
  return (
    <div className="lg:flex w-1/4 hidden flex-col dark:bg-darkbg  sticky top-24 h-96 rounded-lg px-3 py-4 border border-slate-300 dark:border-darkborder border-solid ">
      {filteredUsers?.map((item, i) => (
        <Link
          href={`/home/profile/${item?._id}`}
          key={i}
          className="w-full flex items-start justify-start my-3"
        >
          <div className=" rounded-full">
            <Image
              src={item?.profileImage || userImage}
              alt="user"
              className="rounded-full w-16 h-16 mx-auto"
              width={1500}
              height={1500}
            />
          </div>
          <div className="font-semibold dark:text-darkmaintext ml-3 flex flex-col items-center justify-center text-base leading-normal text-black opacity-90">
            <span>
              {item?.firstName} {item?.lastName}
            </span>

            <button
              onClick={() => handleConnect(item)}
              className="text-blue-600 rounded-full py-1 px-3 font-semibold duration-300 hover:bg-blue-600 hover:text-white border border-solid border-blue-600"
            >
              Connect
            </button>
          </div>
        </Link>
      ))}
      {filteredUsers?.length === 0 && (
        <span className="dark:text-darkmaintext">
          No recommendatins connections
        </span>
      )}
    </div>
  );
};

export default RightSide;
