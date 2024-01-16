"use client";
import React, { useEffect, useState } from "react";
import userImage from "../../../public/images/user.svg";
import Image from "next/image";
import TestSocket from "@/app/components/TestSocket";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, sendMessageToBE } from "@/app/services/apiHandler";
import { login } from "@/app/rtk/authSlice";
import Link from "next/link";

const Page = () => {
  const userr = useSelector((state) => state.auth.user?.user);
  const [selectedChat, setSelectedChat] = useState(
    userr?.acceptedConnections[0]
  );
  const [channel, setChannel] = useState("");
  const [socket, setSocket] = useState(null);
  const [sendMessage, setSendMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (selectedChat?.chat?.length > 0) {
      setMessages([...selectedChat?.chat]);
    }
  }, [selectedChat]);
  const dispatch = useDispatch();
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
  useEffect(() => {
    if (selectedChat?.chat?.length > 0) {
      setMessages([...selectedChat?.chat]);
    } else {
      setMessages([]); // Clear messages when there is no chat in selectedChat
    }
  }, [selectedChat]);

  useEffect(() => {
    const userConnection = userr?.acceptedConnections?.find(
      (conn) =>
        (conn?.receiverId === selectedChat?.receiverId &&
          conn?.requesterId === selectedChat?.requesterId) ||
        (conn?.requesterId === selectedChat?.receiverId &&
          conn?.receiverId === selectedChat?.requesterId)
    );

    if (selectedChat?.channel === userConnection?.channel) {
      setChannel(selectedChat?.channel);
    }
  }, [selectedChat]);
  const handleSendMessage = async () => {
    if (channel) {
      if (socket !== null) {
        socket.emit("send message", {
          sendMessage: sendMessage,
          channel: channel,
          receiverId:
            selectedChat?.receiverId === userr?._id
              ? selectedChat?.requesterId
              : selectedChat?.receiverId,
        });

        setMessages((prev) => [
          ...prev,
          {
            senderId: userr?._id,
            content: sendMessage,
            receiverId: selectedChat?.receiverId,
          },
        ]);
        setSendMessage("");
        try {
          const res = await sendMessageToBE(
            selectedChat?.receiverId === userr?._id
              ? selectedChat?.requesterId
              : selectedChat?.receiverId,
            sendMessage
          );
        } catch (error) {
          throw error;
        }

        // setTimeout(async () => {
        //   await loginUser();
        // }, 500);
      }
    }
  };
  useEffect(() => {
    if (openMessage === false) {
      setChannel(userr?._id);
    }
  }, [openMessage]);
  const handleOpenMessage = (chat) => {
    setSelectedChat(chat);
    setOpenMessage(true);
  };

  useEffect(() => {
    const newSocket = io("https://linkedin-websockets.onrender.com", {
      query: { id: channel },
    });
    setSocket(newSocket);
    newSocket.on("connected", () => {
      console.log("connected");
    });
    newSocket.on("received message", (message) => {
      console.log(message);
      console.log(selectedChat?.requesterId, userr?._id);
      setMessages((prev) => [
        ...prev,
        {
          senderId: selectedChat?.requesterId,
          content: message,
          receiverId: userr?._id,
        },
      ]);
      // updateFilterdMessages();

      // You may want to update the state and perform other actions here
    });
    return () => {
      newSocket.disconnect();
    };
  }, [userr, messages, channel]);

  const [filterdMessages, setFilterdMessages] = useState([]);
  const updateFilterdMessages = () => {
    const updatedFilterdMessages = messages.filter((message) =>
      selectedChat?.chat.some(
        (chatMessage) =>
          (message?.receiverId === chatMessage?.receiverId &&
            message?.senderId === chatMessage?.senderId) ||
          (message?.senderId === chatMessage?.receiverId &&
            message?.receiverId === chatMessage?.senderId)
      )
    );
    setFilterdMessages(updatedFilterdMessages);
  };

  console.log(filterdMessages);
  console.log(messages);

  return (
    <>
      <div className="hidden md:flex flex-col px-3 mt-24">
        <div className="flex w-11/12 md:px-0  mx-auto mt-2 border border-solid border-slate-300">
          <div
            className={` px-2 bg-white min-h-64 flex flex-col justify-start items-start duration-300 ${
              userr?.acceptedConnections?.length > 0 ? "w-2/5" : "w-full"
            } overflow-hidden rounded-lg `}
          >
            {userr?.acceptedConnections?.length > 0 ? (
              userr?.acceptedConnections?.map((chat) => (
                <div
                  key={chat._id}
                  className={`flex items-center px-1 py-2 my-2 w-full hover:bg-slate-300 hover:text-white rounded-md cursor-pointer duration-300 ${
                    selectedChat?._id === chat?._id
                      ? "bg-slate-300 text-white"
                      : ""
                  }`}
                  onClick={() => handleOpenMessage(chat)}
                >
                  <Image
                    src={
                      (userr?.profileImage === chat?.receiverProfileImage
                        ? chat?.requesterProfileImage
                        : chat?.receiverProfileImage) || userImage
                    }
                    alt={
                      userr?.receiverFirstName === chat?.receiverFirstName
                        ? requesterFirstName
                        : chat?.receiverFirstName
                    }
                    className="w-14 h-14 rounded-full mr-4"
                    width={1500}
                    height={1500}
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-black">
                      {chat?.receiverFirstName === userr?.firstName
                        ? chat?.requesterFirstName
                        : chat?.receiverFirstName}
                      {chat?.receiverLastName === userr?.lastName
                        ? chat?.requesterLastName
                        : chat?.receiverLastName}
                    </h3>
                    <h3 className="text-sm font-semibold text-green-500">
                      Online
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <Link href="/home/network" className="text-blue-500 underline ">
                You don't have connections Lets connect some poeple
              </Link>
            )}
          </div>

          {userr?.acceptedConnections?.length > 0 && (
            <div className="w-full   flex flex-col justify-between    border-l border-solid border-slate-300">
              {selectedChat && (
                <div className="flex items-center p-3 border-b border-slate-300 border-solid">
                  <Image
                    src={
                      (selectedChat?.receiverProfileImage ===
                      userr?.profileImage
                        ? selectedChat?.requesterProfileImage
                        : selectedChat?.receiverProfileImage) || userImage
                    }
                    alt={
                      selectedChat.receiverFirstName ===
                      selectedChat?.receiverFirstName
                        ? selectedChat?.requesterFirstName
                        : selectedChat?.receiverFirstName
                    }
                    className="w-14 h-14 rounded-full mr-3"
                    width={1500}
                    height={1500}
                  />
                  <div>
                    <h3 className="text-sm font-semibold">
                      {selectedChat?.receiverFirstName === userr?.firstName
                        ? selectedChat?.requesterFirstName
                        : selectedChat?.receiverFirstName}
                      {selectedChat?.receiverLastName === userr?.lastName
                        ? selectedChat?.requesterLastName
                        : selectedChat?.receiverLastName}
                    </h3>
                    <h3 className="text-sm font-semibold text-green-500">
                      Online
                    </h3>
                  </div>
                </div>
              )}
              <div className="flex items-center flex-col h-64 overflow-auto border-b-slate-300 border-solid px-4">
                {messages?.map((message, i) => (
                  <div
                    key={i}
                    className={`flex justify-${
                      message.senderId === userr?._id
                        ? "end text-blue-600"
                        : "start text-red-600"
                    } w-full my-2 font-semibold`}
                  >
                    <span>{message?.content}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center">
                <input
                  className="w-full ml-2 px-2 h-10 rounded border focus:outline-none focus:border-blue-600  border-slate-300 border-solid"
                  placeholder="Type your message..."
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                />
                <button
                  className="w-fit m-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 duration-300"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex md:hidden flex-col px-3 mt-24">
        <button
          onClick={() => setOpenMessage(false)}
          className={` duration-300 flex md:hidden mx-auto ${
            openMessage ? "opacity-100" : "opacity-0"
          }`}
        >
          Back
        </button>
        <div className="flex w-11/12 md:px-0 relative  md:w-4/5 mx-auto mt-2 border border-solid border-slate-300">
          <div
            className={` left-0 top-0  bg-white h-full ${
              userr?.acceptedConnections?.length > 0
                ? ""
                : "flex justify-center items-center"
            }  ${
              openMessage ? "w-0 " : "w-full px-3"
            } duration-300 md:w-1/3 overflow-hidden rounded-lg  absolute  border-r border-solid border-slate-300`}
          >
            {userr?.acceptedConnections?.length > 0 ? (
              userr?.acceptedConnections?.map((chat) => (
                <div
                  key={chat._id}
                  className={`flex items-center px-1 py-2 my-2 hover:bg-slate-300 hover:text-white rounded-md cursor-pointer duration-300 ${
                    selectedChat?._id === chat?._id
                      ? "bg-slate-300 text-white"
                      : ""
                  }`}
                  onClick={() => handleOpenMessage(chat)}
                >
                  <Image
                    src={
                      (userr?.profileImage === chat?.receiverProfileImage
                        ? chat?.requesterProfileImage
                        : chat?.receiverProfileImage) || userImage
                    }
                    alt={
                      userr?.receiverFirstName === chat?.receiverFirstName
                        ? requesterFirstName
                        : chat?.receiverFirstName
                    }
                    className="w-14 h-14 rounded-full mr-4"
                    width={1500}
                    height={1500}
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-black">
                      {chat?.receiverFirstName === userr?.firstName
                        ? chat?.requesterFirstName
                        : chat?.receiverFirstName}
                      {chat?.receiverLastName === userr?.lastName
                        ? chat?.requesterLastName
                        : chat?.receiverLastName}{" "}
                    </h3>
                    <h3 className="text-sm font-semibold text-green-500">
                      Online
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <Link href="/home/network" className="text-blue-500 underline">
                You don't have connections Lets connect some poeple{" "}
              </Link>
            )}
          </div>

          <div className="w-full   flex flex-col justify-between ">
            {selectedChat && (
              <div className="flex items-center p-3 border-b border-slate-300 border-solid">
                <Image
                  src={
                    (selectedChat?.receiverProfileImage === userr?.profileImage
                      ? selectedChat?.requesterProfileImage
                      : selectedChat?.receiverProfileImage) || userImage
                  }
                  alt={
                    selectedChat.receiverFirstName ===
                    selectedChat?.receiverFirstName
                      ? selectedChat?.requesterFirstName
                      : selectedChat?.receiverFirstName
                  }
                  className="w-14 h-14 rounded-full mr-3"
                  width={1500}
                  height={1500}
                />
                <div>
                  <h3 className="text-sm font-semibold">
                    {selectedChat?.receiverFirstName === userr?.firstName
                      ? selectedChat?.requesterFirstName
                      : selectedChat?.receiverFirstName}
                    {selectedChat?.receiverLastName === userr?.lastName
                      ? selectedChat?.requesterLastName
                      : selectedChat?.receiverLastName}
                  </h3>
                  <h3 className="text-sm font-semibold text-green-500">
                    Online
                  </h3>
                </div>
              </div>
            )}
            <div className="flex items-center flex-col h-64 overflow-auto border-b-slate-300 border-solid px-4">
              {messages?.map((message, i) => (
                <div
                  key={i}
                  className={`flex justify-${
                    message.senderId === userr?._id
                      ? "end text-blue-600"
                      : "start text-red-600"
                  } w-full my-2 font-semibold`}
                >
                  <span>{message?.content}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center">
              <input
                className="w-full ml-2 px-2 h-10 rounded border focus:outline-none focus:border-blue-600  border-slate-300 border-solid"
                placeholder="Type your message..."
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
              />
              <button
                className="w-fit m-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 duration-300"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
