"use client";
import React, { useEffect, useState } from "react";
import userImage from "../../../public/images/user.svg";
import Image from "next/image";
import TestSocket from "@/app/components/TestSocket";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { getAllUsers } from "@/app/services/apiHandler";

const Page = () => {
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
  const [chats, setChats] = useState([
    {
      id: 1,
      user: {
        id: 1,
        name: "Ahmed",
        image: userImage,
      },
      messages: [
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 2, senderName: "John Doe", message: "Hello there!" },
        { id: 3, senderName: "John Doe", message: "Hello there!" },
        { id: 4, senderName: "John Doe", message: "Hello there!" },
        { id: 5, senderName: "John Doe", message: "Hello there!" },
        { id: 6, senderName: "John Doe", message: "Hello there!" },
        { id: 7, senderName: "John Doe", message: "Hello there!" },
        { id: 8, senderName: "John Doe", message: "Hello there!" },
        { id: 9, senderName: "John Doe", message: "Hello there!" },
        { id: 10, senderName: "John Doe", message: "Hello there!" },
        { id: 11, senderName: "John Doe", message: "Hello there!" },
      ],
    },
    {
      id: 2,
      user: {
        id: 2,
        name: "Omar",
        image: userImage,
      },
      messages: [
        { id: 1, senderName: "Omar", message: "Hello there!" },
        { id: 2, senderName: "John Doe", message: "Hello there!" },
        { id: 3, senderName: "John Doe", message: "Hello there!" },
        { id: 4, senderName: "John Doe", message: "Hello there!" },
        { id: 5, senderName: "Omar", message: "Hello there!" },
        { id: 6, senderName: "John Doe", message: "Hello there!" },
        { id: 8, senderName: "Omar", message: "Hello there!" },
        { id: 9, senderName: "Omar ", message: "Hello there!" },
        { id: 10, senderName: "John Doe", message: "Hello there!" },
        { id: 11, senderName: "Omar", message: "Hello there!" },
        { id: 12, senderName: "John Doe", message: "Hello there!" },
      ],
    },
    // Add more chats as needed
  ]);
  const userr = useSelector((state) => state.auth.user?.user);
  const [selectedChat, setSelectedChat] = useState(users[0]);
  const [socket, setSocket] = useState(null);
  const [sendMessage, setSendMessage] = useState("");
  const [receiveMessage, setReceiveMessage] = useState("");

  const handleSendMessage = () => {
    if (socket !== null) {
      socket.emit("send message", sendMessage, selectedChat?._id);
    }
    // const { user, messages, newMessage } = selectedChat;
    // if (newMessage.trim() !== "") {
    //   const updatedMessages = [
    //     ...messages,
    //     { id: messages.length + 1, senderName: user.name, message: newMessage },
    //   ];
    //   const updatedChats = chats.map((chat) =>
    //     chat.id === selectedChat.id
    //       ? { ...chat, messages: updatedMessages }
    //       : chat
    //   );
    //   setChats(updatedChats);
    //   setSelectedChat({
    //     ...selectedChat,
    //     messages: updatedMessages,
    //     newMessage: "",
    //   });
    // }
  };
  useEffect(() => {
    if (socket !== null) {
      socket.on("received message", (message) => {
        setReceiveMessage(message);
        console.log(message);
      });
    }
  }, [handleSendMessage, socket]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      query: { id: userr?._id },
    });
    setSocket(newSocket);
    newSocket.on("connected", () => {
      console.log("connected");
    });
    return () => {
      newSocket.disconnect();
    };
  }, [userr]);

  return (
    <div className="flex w-3/5 mx-auto mt-24 border border-solid border-slate-300">
      <div className="w-1/3 overflow-hidden rounded-lg shadow p-4">
        {users.map((chat) => (
          <div
            key={chat._id}
            className={`flex items-center p-3 cursor-pointer duration-300 ${
              selectedChat?._id === chat?._id ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <span>{chat.firstName}</span>
            {/* <Image
              src={userImage}
              alt={chat.user.name}
              className="w-10 h-10 rounded-full mr-3"
              width={1000}
              height={1000}
            />
            <div>
              <h3 className="text-sm font-semibold">{chat.user.name}</h3>
              <p className="text-sm">
                {chat.messages[chat.messages.length - 1]?.message}
              </p>
            </div> */}
          </div>
        ))}
      </div>

      {/* <div className="w-2/3 p-4 flex flex-col justify-between ">
        <div className="bg-gray-100 py-4 mb-4 flex flex-col">
          <div className="flex items-center  border-b-slate-300 border-solid px-4">
            <Image
              src={userImage}
              alt={selectedChat.user.name}
              className="w-12 h-12 rounded-full mb-2 mr-2"
            />
            <div>
              <h2 className="text-lg font-semibold text-center">
                {selectedChat.user.name}
              </h2>
              <span className="text-green-500">Online</span>
            </div>
          </div>
          <div className="mt-4 h-64 overflow-auto custom-scrollbar">
            {selectedChat.messages.map((message) => {
              const isCurrentUser =
                message.senderName === selectedChat.user.name;

              return (
                <div
                  key={message.id}
                  className={`mb-2 ${
                    isCurrentUser ? "text-right" : "text-left"
                  }`}
                >
                  <span className="font-semibold">{message.senderName}:</span>{" "}
                  {message.message}
                </div>
              );
            })}
          </div>
        </div>
          */}
      <div>
        <textarea
          className="w-full h-24 p-2 mb-2 rounded border border-slate-300 border-solid"
          placeholder="Type your message..."
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
        ></textarea>
        <button
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
      {/*  </div> */}
      {/* <TestSocket /> */}
      {receiveMessage && <h2>{receiveMessage}</h2>}
    </div>
  );
};

export default Page;
