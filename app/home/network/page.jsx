// "use client";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import share from "@/public/images/shared-image.jpg";
// import Image from "next/image";
// import { connect, getAllUsers } from "@/app/services/apiHandler";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "@/app/rtk/authSlice";
// import io from "socket.io-client";
// import Recommendations from "@/app/components/Recommendations";
// import Accepted from "@/app/components/Accepted";
// import Pending from "@/app/components/Pending";
// import { ToastContainer, toast } from "react-toastify";

// const page = () => {
//   const dispatch = useDispatch();
//   const [users, setUsers] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const user = useSelector((state) => state.auth.user?.user);
//   const status = useSelector((state) => state.auth.status);
//   const [message, setMessage] = useState({
//     message: "",
//     type: "",
//   });
//   const [selectedTab, setSelectedTab] = useState("recommendations");
//   useEffect(() => {
//     const newSocket = io("http://localhost:3001", {
//       query: { id: user?._id },
//     });
//     setSocket(newSocket);
//     newSocket.emit("connection", () => {
//       console.log("connection");
//     });
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [user]);
//   const loginUser = async () => {
//     try {
//       await dispatch(login()).then((data) => {
//         typeof window !== "undefined" &&
//           localStorage.setItem("user", JSON.stringify(data.payload));
//       });
//     } catch (error) {
//       console.error("Error logging in:", error);
//     }
//   };

//   const sendConnectToSocket = async (item) => {
//     if (socket !== null) {
//       socket.emit("send connect", item, user);
//       await loginUser();
//     }
//   };
//   const handleGetUsers = async () => {
//     try {
//       const res = await getAllUsers();
//       if (res.status === 200) {
//         setUsers(res.data);
//       }
//     } catch (err) {
//       throw err;
//     }
//   };
//   useEffect(() => {
//     if (socket !== null) {
//       socket.on("send connect", async (message) => {
//         setMessage({
//           message: `You send request `,
//           type: "received connect",
//         });
//       });
//     }
//   }, [socket]);
//   useEffect(() => {
//     if (socket !== null) {
//       socket.on("received connect", async (message) => {
//         setMessage({
//           message: `You received a new connect request from  ${message?.requester?.firstName}`,
//           type: "received connect",
//         });
//       });
//     }
//   }, [socket]);
//   useEffect(() => {
//     const test = async () => {
//       if (message?.type === "send connect") {
//         console.log(message?.message);
//       }
//     };
//     setMessage({
//       message: "",
//       type: "",
//     });
//     test();
//   }, [message]);
//   useEffect(() => {
//     const test = async () => {
//       if (message?.type === "received connect") {
//         console.log(message?.message);
//       }
//     };
//     setMessage({
//       message: "",
//       type: "",
//     });
//     test();
//   }, [message]);
//   useEffect(() => {
//     handleGetUsers();
//   }, []);
//   const sendConnectToServer = async (item) => {
//     try {
//       const res = await connect(item?._id);
//       if (res.status === 200) {
//         // await loginUser();
//       }
//     } catch (err) {
//       throw err;
//     }
//   };
//   const handleConnect = async (item) => {
//     sendConnectToServer(item);
//     sendConnectToSocket(item);
//     // await loginUser();
//   };
//   const filteredUsers = users.filter(
//     (item) =>
//       !user?.pendingConnections.some(
//         (conn) =>
//           conn?.receiverId === item?._id || conn?.requesterId === item?._id
//       ) &&
//       !user?.acceptedConnections.some(
//         (conn) =>
//           conn?.receiverId === item?._id || conn?.requesterId === item?._id
//       )
//   );
//   return (
//     <div className="container flex flex-col   mx-auto py-4 px-16 mt-20 ">
//       <div className="w-full flex flex-col sm:flex-row justify-around  border border-solid  border-slate-300 py-4 px-3">
//         <ToastContainer />
//         <button
//           onClick={() => setSelectedTab("recommendations")}
//           className={`flex items-center justify-between font-extrabold  py-3 text-blue-600  ${
//             selectedTab === "recommendations"
//               ? "border-b opacity-100 border-blue-600 border-solid"
//               : "opacity-70"
//           }`}
//         >
//           <div className="flex items-center opacity-70">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               data-supported-dps="24x24"
//               fill="currentColor"
//               class="mercado-match"
//               width="24"
//               height="24"
//               focusable="false"
//             >
//               <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
//             </svg>
//             <span className="mr-2">Recommendations</span>
//           </div>
//           <span>{filteredUsers.length}</span>
//         </button>
//         <button
//           onClick={() => setSelectedTab("connections")}
//           className={`flex items-center justify-between font-extrabold  py-3 text-green-600  ${
//             selectedTab === "connections"
//               ? "border-b opacity-100 border-green-600 border-solid"
//               : "opacity-70"
//           }`}
//         >
//           <div className="flex items-center opacity-70">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               data-supported-dps="24x24"
//               fill="currentColor"
//               class="mercado-match"
//               width="24"
//               height="24"
//               focusable="false"
//             >
//               <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
//             </svg>
//             <span className="mr-2">Connections</span>
//           </div>
//           <span>{user?.acceptedConnections?.length}</span>
//         </button>
//         <button
//           onClick={() => setSelectedTab("pending")}
//           className={`flex items-center justify-between font-extrabold  py-3 text-orange-600  ${
//             selectedTab === "pending"
//               ? "border-b opacity-100 border-orange-600 border-solid"
//               : "opacity-70"
//           }`}
//         >
//           <div className="flex items-center opacity-70">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               data-supported-dps="24x24"
//               fill="currentColor"
//               class="mercado-match"
//               width="24"
//               height="24"
//               focusable="false"
//             >
//               <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
//             </svg>
//             <span className="mr-2 ">Pending</span>
//           </div>
//           <span>{user?.pendingConnections?.length}</span>
//         </button>
//       </div>

//       <div className="flex flex-wrap items-center justify-center my-4  w-full   border border-slate-300 border-solid py-3 px-8">
//         {selectedTab === "recommendations" && (
//           <Recommendations
//             user={user}
//             users={users}
//             handleConnect={handleConnect}
//           />
//         )}
//         {selectedTab === "connections" && (
//           <Accepted user={user} handleConnect={handleConnect} />
//         )}
//         {selectedTab === "pending" && (
//           <Pending user={user} handleConnect={handleConnect} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default page;
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import share from "@/public/images/shared-image.jpg";
import Image from "next/image";
import { connect, getAllUsers } from "@/app/services/apiHandler";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/app/rtk/authSlice";
import io from "socket.io-client";
import Recommendations from "@/app/components/Recommendations";
import Accepted from "@/app/components/Accepted";
import Pending from "@/app/components/Pending";
import { ToastContainer, toast } from "react-toastify";

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

    newSocket.on("send connect", (message) => {});

    return () => {
      newSocket.disconnect();
    };
  }, [user]);
  useEffect(() => {
    if (socket !== null) {
      socket.on("received connect", async (message) => {
        toast.success(
          `You received a new connect request from ${message?.sender?.firstName}`
        );
        setTimeout(async () => {
          await loginUser();
        }, 1000);
      });
    }
  }, [socket]);
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
      toast.success(`You send a new connect request to ${item?.firstName}`);
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

  return (
    <div className="container flex flex-col   mx-auto py-4 px-16 mt-20 ">
      <div className="w-full flex flex-col sm:flex-row justify-around  border border-solid  border-slate-300 py-4 px-3">
        <ToastContainer />
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

      <div className="flex flex-wrap items-center justify-center my-4  w-full   border border-slate-300 border-solid py-3 px-8">
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
