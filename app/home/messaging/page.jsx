"use client";
import React, { useState } from "react";
import userImage from "../../../public/images/user.svg";
import Image from "next/image";

const Page = () => {
  const [chats, setChats] = useState([
    {
      id: 1,
      user: {
        name: "Omar",
        image: userImage,
      },
      messages: [
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
      ],
    },
    {
      id: 2,
      user: {
        name: "Omar",
        image: userImage,
      },
      messages: [
        { id: 1, senderName: "Omar", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "Omar", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "Omar", message: "Hello there!" },
        { id: 1, senderName: "Omar ", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
        { id: 1, senderName: "Omar", message: "Hello there!" },
        { id: 1, senderName: "John Doe", message: "Hello there!" },
      ],
    },
    // Add more chats as needed
  ]);

  const [selectedChat, setSelectedChat] = useState(chats[0]);

  const handleSendMessage = () => {
    const { user, messages, newMessage } = selectedChat;
    if (newMessage.trim() !== "") {
      const updatedMessages = [
        ...messages,
        { id: messages.length + 1, senderName: user.name, message: newMessage },
      ];
      const updatedChats = chats.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, messages: updatedMessages }
          : chat
      );
      setChats(updatedChats);
      setSelectedChat({
        ...selectedChat,
        messages: updatedMessages,
        newMessage: "",
      });
    }
  };

  return (
    <div className="flex w-3/5 mx-auto mt-24 border border-solid border-slate-300">
      {/* Chats List Section */}
      <div className="w-1/3 overflow-hidden rounded-lg shadow p-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-3 cursor-pointer duration-300 ${
              selectedChat.id === chat.id ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <Image
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
            </div>
          </div>
        ))}
      </div>

      {/* Selected Chat Section */}
      <div className="w-2/3 p-4 flex flex-col justify-between ">
        {/* Chat Info Section */}
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
          {/* Display Old Messages */}
          <div className="mt-4 h-64 overflow-auto custom-scrollbar">
            {selectedChat.messages.map((message) => {
              const isCurrentUser =
                message.senderName === selectedChat.user.name;
              console.log(isCurrentUser);
              console.log(message.senderName);
              console.log(selectedChat.user.name);

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

        {/* Compose Section */}
        <div>
          <textarea
            className="w-full h-24 p-2 mb-2 rounded border"
            placeholder="Type your message..."
            value={selectedChat.newMessage}
            onChange={(e) =>
              setSelectedChat({
                ...selectedChat,
                newMessage: e.target.value,
              })
            }
          ></textarea>
          <button
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
