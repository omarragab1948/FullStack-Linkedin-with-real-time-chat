import React from "react";
import Image from "next/image";
import userImage from "@/public/images/user.svg";
import { useSelector } from "react-redux";

const Accepted = ({ user }) => {
  const status = useSelector((state) => state.auth?.status);

  if (status === "loading") {
    return (
      <div
        className={`border-4 mt-3 border-solid mr-4  border-gray-400 border-t-blue-500  rounded-full w-8 h-8 animate-spin`}
      ></div>
    );
  }
  console.log(user?.acceptedConnections);
  return (
    <>
      {user?.acceptedConnections && user?.acceptedConnections.length > 0 ? (
        user?.acceptedConnections.map((item, i) => (
          <div
            key={i}
            className="text-center  flex flex-col sm:flex-row  items-center justify-between px-1 hover:scale-105 rounded-md overflow-hidden  p-3  my-3 w-full mx-2 duration-300  hover:bg-slate-300"
          >
            <div className="flex items-center flex-col sm:flex-row   rounded-full ">
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
              <div className="font-semibold flex flex-col justify-center ml-3  text-base leading-normal text-black  opacity-90">
                {item?.receiverId === user?._id ? (
                  <span>{item?.requesterFirstName} </span>
                ) : (
                  <span>{item?.receiverFirstName} </span>
                )}
                <div className="font-normal flex justify-center  text-md leading-snug my-1">
                  Front-End
                </div>
              </div>
            </div>

            <button
              onClick={() => handleConnect(item)}
              className="text-blue-600 rounded-full py-1 px-3 font-semibold duration-300 hover:bg-blue-600 hover:text-white border border-solid border-blue-600"
            >
              Send a message
            </button>
          </div>
        ))
      ) : (
        <span>No connections</span>
      )}
    </>
  );
};

export default Accepted;
