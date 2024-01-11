// // TestSocket.jsx

// import { useState, useEffect } from "react";
// import io from "socket.io-client";
// import { test } from "../services/apiHandler";

// const TestSocket = () => {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");

//   const socketInitializer = () => {
//     const newSocket = io("http://localhost:3001");
//     setSocket(newSocket);

//     newSocket.on("message", async (message) => {
//       console.log(message);
//       await test();

//       setMessages((prevMessages) => {
//         if (prevMessages.some((msg) => msg.id === message.id)) {
//           return prevMessages;
//         }
//         return [...prevMessages, message];
//       });
//     });
//   };
//   console.log(messages);

//   const sendMessage = () => {
//     if (inputMessage.trim() !== "") {
//       const messageId = Math.random().toString(36).substring(7);
//       socket.emit("message", {
//         id: messageId,
//         user: "Omar",
//         text: inputMessage,
//       });
//       setInputMessage("");
//     }
//   };

//   useEffect(() => {
//     socketInitializer();
//   }, []);
//   const [socket2, setSocket2] = useState(null);
//   const [messages2, setMessages2] = useState([]);
//   const [inputMessage2, setInputMessage2] = useState("");
//   console.log(messages2);

//   const socketInitializer2 = () => {
//     const newSocket = io("http://localhost:3001");
//     setSocket2(newSocket);

//     newSocket.on("message", async (message) => {
//       console.log(message);
//       await test();
//       setMessages2((prevMessages) => {
//         // Check if the message already exists in the array
//         if (prevMessages.some((msg) => msg.id === message.id)) {
//           return prevMessages;
//         }
//         return [...prevMessages, message];
//       });
//     });
//   };

//   const sendMessage2 = () => {
//     if (inputMessage2.trim() !== "") {
//       // Generate a unique id for the new message (replace this logic with your own)
//       const messageId = Math.random().toString(36).substring(7);
//       socket2.emit("message", {
//         id: messageId,
//         user: "Ahmad",
//         text: inputMessage2,
//       });
//       setInputMessage2("");
//     }
//   };

//   useEffect(() => {
//     socketInitializer2();
//   }, []);

//   return (
//     <div className="flex flex-col ">
//       <div className="flex flex-col ">
//         <div className="flex flex-col border border-solid border-slate-300">
//           <div className="flex-1 overflow-y-auto px-4">
//             <h2 className="text-2xl font-semibold mb-4">Omar</h2>
//             <div>
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`${
//                     message.user === "Omar"
//                       ? "text-green-600 text-left"
//                       : "text-blue-600 text-right"
//                   } mb-2`}
//                 >
//                   <span className="font-bold">{message.user}: </span>
//                   {message.text}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="p-4">
//             <input
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               placeholder="Type your message..."
//               className="border rounded p-2 w-full mb-2"
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col border border-solid border-slate-300 mt-4">
//         <div className="flex-1 overflow-y-auto px-4">
//           <h2 className="text-2xl font-semibold mb-4">Ahmed</h2>
//           <div>
//             {messages2.map((message) => (
//               <div
//                 key={message.id}
//                 className={`${
//                   message.user === "Omar"
//                     ? "text-green-600 text-left"
//                     : "text-blue-600 text-right"
//                 } mb-2`}
//               >
//                 <span className="font-bold">{message.user}: </span>
//                 {message.text}
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="p-4">
//           <input
//             type="text"
//             value={inputMessage2}
//             onChange={(e) => setInputMessage2(e.target.value)}
//             placeholder="Type your message..."
//             className="border rounded p-2 w-full mb-2"
//           />
//           <button
//             onClick={sendMessage2}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestSocket;
// Chat.js (React component)
// TestSocket.jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const TestSocket = () => {
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const senderId = "1";
  const receiverId = "2";
  const roomId = "3";
  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    // Join the chat room when the component mounts
    newSocket.emit("join", roomId);

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("message", message);
    });

    return () => {
      // Disconnect the socket when the component unmounts
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      // Send the message to the server
      socket.emit("message", {
        senderId,
        receiverId,
        text: inputMessage,
      });
      setInputMessage("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <span>{message.user}: </span>
            {message.text}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default TestSocket;
