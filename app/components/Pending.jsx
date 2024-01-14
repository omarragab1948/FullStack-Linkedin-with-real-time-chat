import React, { useEffect, useState } from "react";
import Image from "next/image";
import userImage from "@/public/images/user.svg";
import io from "socket.io-client";
import { acceptConnect, rejectConnect } from "../services/apiHandler";
import { login } from "../rtk/authSlice";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Pending = ({ user }) => {
  const [socket, setSocket] = useState(null);
  const status = useSelector((state) => state.auth?.status);

  const dispatch = useDispatch();
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      query: { id: user?._id },
    });
    setSocket(newSocket);
    newSocket.on("connected", () => {});
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
  const sendAcceptToSocket = async (item) => {
    if (socket !== null) {
      socket.emit("accept connect", item);
      toast.success(
        `You accept connect request from ${item?.requesterFirstName}`
      );
      setTimeout(async () => {
        await loginUser();
      }, 1000);
    }
  };
  const handleAccept = async (item) => {
    try {
      const res = await acceptConnect(item);
      if (res.status === 200) {
        sendAcceptToSocket(item);
      }
    } catch (e) {
      throw e;
    }
  };
  const sendRejectToSocket = async (item) => {
    if (socket !== null) {
      socket.emit("reject connect", item);
      toast.success(
        `You reject a connect request from ${item?.requesterFirstName}`
      );
      setTimeout(async () => {
        await loginUser();
      }, 1000);
    }
  };
  const handleReject = async (item) => {
    try {
      const res = await rejectConnect(item);
      if (res.status === 200) {
        sendRejectToSocket(item);
      }
    } catch (e) {
      throw e;
    }
  };

  if (status === "loading") {
    return (
      <div
        className={`border-4 mt-3 border-solid mr-4  border-gray-400 border-t-blue-500  rounded-full w-8 h-8 animate-spin`}
      ></div>
    );
  }
  return (
    <>
      {user?.pendingConnections && user?.pendingConnections.length > 0 ? (
        user?.pendingConnections.map((item, i) => (
          <div
            key={i}
            className="text-center hover:scale-105 rounded-t-xl overflow-hidden rounded pb-3 w-4/5 sm:w-3/5 my-3 lg:w-1/4 mx-2 duration-300 border border-solid border-slate-300 hover:bg-slate-300"
          >
            <div className="w-full">
              {item?.receiverBackgroundImage ? (
                <Image
                  src={item?.receiverBackgroundImage}
                  alt="user"
                  width={1500}
                  height={1500}
                  className="rounded-t-xl w-full h-32 mx-auto"
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-b from-slate-400 to-slate-50 rounded-t-xl"></div>
              )}
            </div>
            <div className="relative bottom-10  rounded-full ">
              {item?.receiverProfileImage ? (
                <Image
                  src={
                    item?.receiverId === user?._id
                      ? item?.requesterProfileImage
                      : item?.receiverProfileImage
                  }
                  width={1500}
                  height={1500}
                  alt="user"
                  className="rounded-full h-24 w-24 mx-auto"
                />
              ) : (
                <Image
                  src={userImage}
                  width={1500}
                  height={1500}
                  alt="user"
                  className="rounded-full h-24 w-24 mx-auto"
                />
              )}
            </div>
            <div className="font-semibold flex justify-center relative bottom-6 text-base leading-normal text-black  opacity-90">
              {item?.receiverId === user?._id ? (
                <span>{item?.requesterFirstName} </span>
              ) : (
                <span>{item?.receiverFirstName} </span>
              )}
            </div>
            <div className="font-normal flex justify-center relative bottom-6 text-md leading-snug mt-1">
              Front-End
            </div>
            {item?.requesterId === user?._id && <span>Pending</span>}
            {item?.receiverId === user?._id && (
              <div className="flex items-center justify-around">
                <button
                  onClick={() => handleAccept(item)}
                  className="text-blue-600 rounded-full py-1 px-3 font-semibold duration-300 hover:bg-blue-600 hover:text-white border border-solid border-blue-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(item)}
                  className="text-red-600 rounded-full py-1 px-3 font-semibold duration-300 hover:bg-red-600 hover:text-white border border-solid border-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <span>No pending connections</span>
      )}
    </>
  );
};

export default Pending;
