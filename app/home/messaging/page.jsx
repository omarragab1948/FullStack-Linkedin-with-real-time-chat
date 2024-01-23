"use client";
import React, { useEffect, useState } from "react";
import userImage from "../../../public/images/user.svg";
import Image from "next/image";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageToBE } from "@/app/services/apiHandler";
import Link from "next/link";
import { setChannel } from "@/app/rtk/channelSlice";

const Page = () => {
  const userr = useSelector((state) => state.auth.user?.user);
  const [selectedChat, setSelectedChat] = useState([]);
  const [channel, setChannels] = useState("");
  const [socket, setSocket] = useState(null);
  const [sendMessage, setSendMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedChat?.chat?.length > 0) {
      setMessages([...selectedChat?.chat]);
    }
  }, [selectedChat]);
  useEffect(() => {
    setSelectedChat(userr?.acceptedConnections[0]);
  }, [userr]);
  useEffect(() => {
    if (selectedChat?.chat?.length > 0) {
      setMessages([...selectedChat?.chat]);
    } else {
      setMessages([]);
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
      setChannels(selectedChat?.channel);
      dispatch(setChannel(selectedChat?.channel));
    }
  }, [selectedChat]);
  const handleSendMessage = async () => {
    if (channel) {
      if (socket !== null) {
        socket.emit("send message", {
          sender: userr?._id,
          sendMessage: sendMessage,
          channel: channel,
          receiver:
            selectedChat?.receiverId === userr?._id
              ? selectedChat?.requesterId
              : selectedChat?.receiverId,
        });
        socket.emit("send notification", channel);
        setMessages((prev) => [
          ...prev,
          {
            sender: userr?._id,
            content: sendMessage,
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
      }
    }
  };
  const modifiedOnlineUsers = useSelector(
    (state) => state.onlineUsers?.onlineUsers
  );
  useEffect(() => {
    if (openMessage === false) {
      setChannels(userr?._id);
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
    newSocket.on("connected", () => {});
    newSocket.on("received message", (message, sender) => {
      setMessages((prev) => [
        ...prev,
        {
          sender,
          content: message,
        },
      ]);
    });
    newSocket.on("received notification", () => {
      const old =
        typeof window !== "undefined" &&
        JSON.parse(localStorage.getItem("noti"));
      if (old === null) {
        typeof window !== "undefined" &&
          localStorage.setItem("noti", JSON.stringify(1));
      } else {
        typeof window !== "undefined" &&
          localStorage.setItem("noti", JSON.stringify(old + 1));
      }
    });
  }, [channel]);

  console.log(modifiedOnlineUsers);
  useEffect(() => {
    const handleStorageChange = (event) => {
      console.log(event);
    };

    // Add the event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <>
      <div className="hidden md:flex flex-col px-3 mt-24">
        <div className="flex w-11/12 md:px-0  mx-auto mt-2 border border-solid dark:border-darkborder  border-slate-300">
          <div
            className={` px-2 bg-white dark:bg-darkbg min-h-64 flex flex-col justify-start items-start duration-300 ${
              userr?.acceptedConnections?.length > 0 ? "w-2/5" : "w-full"
            } overflow-hidden rounded-lg `}
          >
            {userr?.acceptedConnections?.length > 0 ? (
              userr?.acceptedConnections?.map((chat) => (
                <div
                  key={chat._id}
                  className={`flex items-center px-1 py-2 my-2 w-full  hover:bg-slate-300 hover:text-white rounded-md cursor-pointer duration-300 ${
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
                    <h3 className="text-sm font-semibold flex items-center text-black">
                      {chat?.receiverFirstName === userr?.firstName
                        ? chat?.requesterFirstName
                        : chat?.receiverFirstName}
                      <span className="ml-1">
                        {chat?.receiverLastName === userr?.lastName
                          ? chat?.requesterLastName
                          : chat?.receiverLastName}
                      </span>
                    </h3>
                    <h3 className="text-sm font-semibold text-green-500">
                      {modifiedOnlineUsers && modifiedOnlineUsers?.length > 0
                        ? modifiedOnlineUsers?.map((online) => {
                            const isOnline =
                              online === chat?.receiverId ||
                              online === chat?.requesterId;

                            return isOnline ? "Online" : "Offline";
                          })
                        : "Offline"}
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
            <div className="w-full dark:bg-darkbg  flex flex-col justify-between  dark:border-darkborder  border-l border-solid border-slate-300">
              {selectedChat && (
                <div className="flex items-center p-3 border-b dark:border-darkborder  border-slate-300 border-solid">
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
                    <h3 className="text-sm font-semibold flex items-center dark:text-darkmaintext">
                      {selectedChat?.receiverFirstName === userr?.firstName
                        ? selectedChat?.requesterFirstName
                        : selectedChat?.receiverFirstName}
                      <span className="ml-1">
                        {selectedChat?.receiverLastName === userr?.lastName
                          ? selectedChat?.requesterLastName
                          : selectedChat?.receiverLastName}
                      </span>
                    </h3>
                    <h3 className="text-sm font-semibold text-green-500">
                      {modifiedOnlineUsers && modifiedOnlineUsers?.length > 0
                        ? modifiedOnlineUsers?.map((online) => {
                            const isOnline =
                              online === selectedChat?.receiverId ||
                              online === selectedChat?.requesterId;

                            return isOnline ? "Online" : "Offline";
                          })
                        : "Offline"}
                    </h3>
                  </div>
                </div>
              )}
              <div className="flex items-center flex-col h-64 overflow-auto dark:text-darksecondtext border-b-slate-300 border-solid px-4">
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
                  disabled={sendMessage.trim() === ""}
                  className={`w-fit m-3 p-2 ${
                    sendMessage.trim() === "" &&
                    "bg-slate-400  hover:bg-slate-400"
                  } bg-blue-500 text-white rounded hover:bg-blue-600 duration-300`}
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
          className={` duration-300 flex md:hidden mx-auto dark:text-darkmaintext ${
            openMessage ? "opacity-100" : "opacity-0"
          }`}
        >
          Back
        </button>
        <div className="flex w-11/12 md:px-0 relative dark:bg-darkbg md:w-4/5 mx-auto mt-2 border dark:border-darkborder border-solid border-slate-300">
          <div
            className={` left-0 top-0  bg-white h-full ${
              userr?.acceptedConnections?.length > 0
                ? ""
                : "flex justify-center items-center"
            }  ${
              openMessage ? "w-0 " : "w-full px-3"
            } duration-300 md:w-1/3 overflow-hidden rounded-lg dark:bg-darkbg absolute dark:border-darkborder border-r border-solid border-slate-300`}
          >
            {userr?.acceptedConnections?.length > 0 ? (
              userr?.acceptedConnections?.map((chat) => (
                <div
                  key={chat._id}
                  className={`flex items-center px-1 py-2 my-2  dark:bg-white hover:bg-slate-300 hover:text-white rounded-md cursor-pointer duration-300 ${
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
                    <h3 className="text-sm font-semibold flex items-center text-black">
                      {chat?.receiverFirstName === userr?.firstName
                        ? chat?.requesterFirstName
                        : chat?.receiverFirstName}
                      <span className="ml-1">
                        {chat?.receiverLastName === userr?.lastName
                          ? chat?.requesterLastName
                          : chat?.receiverLastName}
                      </span>
                    </h3>
                    <h3 className="text-sm font-semibold text-green-500">
                      {modifiedOnlineUsers && modifiedOnlineUsers?.length > 0
                        ? modifiedOnlineUsers?.map((online) => {
                            const isOnline =
                              online === chat?.receiverId ||
                              online === chat?.requesterId;

                            return isOnline ? "Online" : "Offline";
                          })
                        : "Offline"}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <Link href="/home/network" className="text-blue-500 underline">
                You don't have connections Lets connect some poeple
              </Link>
            )}
          </div>

          <div className="w-full dark:bg-darkbg  flex flex-col justify-between ">
            {selectedChat && (
              <div className="flex items-center p-3 border-b dark:border-darkborder border-slate-300 border-solid">
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
                  <h3 className="text-sm font-semibold flex dark:text-darkmaintext">
                    {selectedChat?.receiverFirstName === userr?.firstName
                      ? selectedChat?.requesterFirstName
                      : selectedChat?.receiverFirstName}
                    <span className="ml-1">
                      {selectedChat?.receiverLastName === userr?.lastName
                        ? selectedChat?.requesterLastName
                        : selectedChat?.receiverLastName}
                    </span>
                  </h3>
                  <h3 className="text-sm font-semibold text-green-500">
                    {modifiedOnlineUsers && modifiedOnlineUsers?.length > 0
                      ? modifiedOnlineUsers?.map((online) => {
                          const isOnline =
                            online === selectedChat?.receiverId ||
                            online === selectedChat?.requesterId;

                          return isOnline ? "Online" : "Offline";
                        })
                      : "Offline"}
                  </h3>
                </div>
              </div>
            )}
            <div className="flex items-center flex-col dark:text-darksecondtext h-64 overflow-auto border-b-slate-300 border-solid px-4">
              {messages?.map((message, i) => (
                <div
                  key={i}
                  className={`flex justify-${
                    message.sender === userr?._id ||
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
                disabled={sendMessage.trim() === ""}
                className={`w-fit m-3 p-2 ${
                  sendMessage.trim() === "" && "bg-slate-400 hover:bg-slate-400"
                } bg-blue-500 text-white rounded hover:bg-blue-600 duration-300`}
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
