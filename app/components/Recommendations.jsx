import React, { useEffect, useState } from "react";
import Image from "next/image";
import { connect } from "@/app/services/apiHandler";
import Link from "next/link";
import userImage from "@/public/images/user.svg";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../rtk/authSlice";
import io from "socket.io-client";

const Recommendations = ({ user, users, handleConnect }) => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth?.status);
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
  const sendConnection = (item) => {
    handleConnect(item);
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
  // useEffect(() => {
  //   loginUser();
  // }, [reload]);

  if (status === "loading") {
    return (
      <div
        className={`border-4 mt-3 border-solid mr-4  border-gray-400 border-t-blue-500  rounded-full w-8 h-8 animate-spin`}
      ></div>
    );
  }
  return (
    <>
      {filteredUsers?.map((item, i) => (
        <div
          className="text-center hover:scale-105 rounded-t-xl overflow-hidden rounded pb-3 w-4/5 sm:w-3/5 my-3 lg:w-1/4 mx-2 duration-300 border border-solid border-slate-300 hover:bg-slate-300"
          key={i}
        >
          <div className="w-full">
            <div>
              {item?.backgroundImage ? (
                <Image
                  src={item?.backgroundImage}
                  alt="user"
                  width={1500}
                  height={1500}
                  className="rounded-t-xl w-full h-32 mx-auto"
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-b from-slate-400 to-slate-50 rounded-t-xl"></div>
              )}
            </div>
            <div className="relative bottom-10 rounded-full">
              <Image
                src={item?.profileImage}
                alt="user"
                className="rounded-full w-20 h-20 mx-auto"
                width={1500}
                height={1500}
              />
            </div>
            <div className="font-semibold relative bottom-6 text-base leading-normal text-black opacity-90">
              <span>
                {item?.firstName} {item?.lastName}
              </span>
            </div>
            <div className="font-normal relative bottom-6 text-md leading-snug mt-1">
              Front-End
            </div>
            <button
              onClick={() => sendConnection(item)}
              className="text-blue-600 rounded-full py-1 px-3 font-semibold duration-300 hover:bg-blue-600 hover:text-white border border-solid border-blue-600"
            >
              Connect
            </button>
          </div>
        </div>
      ))}
      {filteredUsers?.length === 0 && (
        <span>No recommendatins connections</span>
      )}
    </>
  );
};

export default Recommendations;
