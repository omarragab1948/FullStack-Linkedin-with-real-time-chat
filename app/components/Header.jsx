"use client";
import Link from "next/link";
import { VscTriangleDown } from "react-icons/vsc";
import { IoMdSearch } from "react-icons/io";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import "../globals.css";
import Image from "next/image";
import { changeMode, searchUsers, signOut } from "../services/apiHandler";
import { login, logout } from "../rtk/authSlice";
import { ToastContainer } from "react-toastify";
import io from "socket.io-client";
import userImage from "/public/images/user.svg";
import { addOnlineUsers } from "../rtk/onlineUsersSlice";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";

const Header = () => {
  const pathname = usePathname();
  const currentPath = pathname.split("/")[2];
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState(0);
  const [connections, setConnections] = useState(0);
  const userr = useSelector((state) => state.auth);

  const handleMode = async (mode) => {
    try {
      const res = await changeMode(mode);
      if (res.status === 200) {
        setTimeout(async () => {
          await loginUser();
        }, 1000);
      }
    } catch (err) {
      throw err;
    }
  };
  const loginUser = async () => {
    try {
      await dispatch(login()).then((data) => {
        setUser(data.payload.user);
        typeof window !== "undefined" &&
          localStorage.setItem("user", JSON.stringify(data.payload));
      });
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const [onlineUsers, setOnlineUsers] = useState(() => {
    const storedUsers =
      typeof window !== "undefined" && localStorage.getItem("onlineUsers");
    return storedUsers ? JSON.parse(storedUsers) : [];
  });
  useEffect(() => {
    dispatch(addOnlineUsers(onlineUsers));
  }, [onlineUsers]);
  useEffect(() => {
    if (socket !== null) {
      socket.on("user online", (id) => {
        if (
          user?._id !== id &&
          id !== undefined &&
          id !== "undefined" &&
          user?._id !== undefined &&
          user?._id !== "undefined" &&
          id !== "" &&
          id.length < 25
        ) {
          setOnlineUsers((prevUsers) => {
            const newOnlineUsers = Array.from(new Set([...prevUsers, id]));
            localStorage.setItem("onlineUsers", JSON.stringify(newOnlineUsers));
            return newOnlineUsers;
          });
        }
      });

      socket.on("user offline", (id) => {
        setOnlineUsers((prevUsers) => {
          if (
            user?._id !== id &&
            id !== undefined &&
            id !== "undefined" &&
            user?._id !== undefined &&
            user?._id !== "undefined" &&
            id !== "" &&
            id.length < 25
          ) {
            const newOnlineUsers = prevUsers.filter((user) => user !== id);
            localStorage.setItem("onlineUsers", JSON.stringify(newOnlineUsers));
            return newOnlineUsers;
          }
        });
      });
      socket.on("new message", async (message) => {
        setNewMessage(newMessage + 1);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, []);
  useEffect(() => {
    const newSocket = io("https://linkedin-websockets.onrender.com", {
      query: { id: user?._id },
    });

    setSocket(newSocket);
    newSocket.on("user online", (id) => {
      if (
        user?._id !== id &&
        id !== undefined &&
        id !== "undefined" &&
        user?._id !== undefined &&
        user?._id !== "undefined" &&
        id !== "" &&
        id.length < 25
      ) {
        setOnlineUsers((prevUsers) => {
          const newOnlineUsers = Array.from(new Set([...prevUsers, id])); // Use Set to keep unique values
          localStorage.setItem("onlineUsers", JSON.stringify(newOnlineUsers));
          return newOnlineUsers;
        });
      }
    });
    newSocket.on("user offline", (id) => {
      if (
        user?._id !== id &&
        id !== undefined &&
        id !== "undefined" &&
        user?._id !== undefined &&
        user?._id !== "undefined" &&
        id !== "" &&
        id?.length < 25
      ) {
        setOnlineUsers((prevUsers) => {
          const newOnlineUsers = prevUsers.filter((user) => user !== id);
          localStorage.setItem("onlineUsers", JSON.stringify(newOnlineUsers));
          return newOnlineUsers;
        });
      }
    });
    newSocket.on("new message", async (message) => {
      setNewMessage(newMessage + 1);
    });
    newSocket.on("connect", () => {});
  }, [user]);
  useEffect(() => {
    setTimeout(async () => {
      await loginUser();
    }, 1500);
  }, [newMessage]);

  useEffect(() => {
    if (socket !== null) {
      socket.on("received connect", async (message) => {
        setConnections(connections + 1);
        setTimeout(async () => {
          await loginUser();
        }, 1000);
        socket.on("user online", (message) => {});
      });
      socket.on("new message", async (message) => {
        setNewMessage(newMessage + 1);
      });
      return () => {
        socket.off("received connect");
      };
    }
  }, [socket]);
  useEffect(() => {
    if (socket !== null) {
      socket.on("connect accepted", async (message) => {
        setConnections(connections + 1);

        setTimeout(async () => {
          await loginUser();
        }, 1000);
      });
      socket.on("new message", async (message) => {
        setNewMessage(newMessage + 1);
      });
      socket.on("connect rejected", async (message) => {
        setConnections(connections + 1);

        setTimeout(async () => {
          await loginUser();
        }, 1000);
      });
    }
  }, [socket]);
  const handleDocumentClick = (e) => {
    // Check if the clicked element is not part of the menu
    if (showMenu && e.target.closest(".menu-container") === null) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener("click", handleDocumentClick);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [showMenu]);

  const handleSignOut = async () => {
    try {
      const res = await signOut();
      if (res.status === 200) {
        socket.emit("user offline", user?._id);
        router.push("/");
        localStorage.removeItem("user");
        dispatch(logout());
      }
    } catch (e) {
      throw e;
    }
  };
  const [search, setSearch] = useState("");
  const [usersToSearch, setUsersToSearch] = useState([]);
  const handleSearch = async () => {
    try {
      const res = await searchUsers(search);
      if (res.status === 200) {
        setUsersToSearch(res.data?.users);
      }
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    if (search.trim() !== "") {
      setTimeout(() => {
        handleSearch();
      }, 500);
    }
  }, [search]);
  const [focus, setFocus] = useState(false);
  const handelOnBlur = () => {
    setTimeout(() => {
      setFocus(false);
      setUsersToSearch([]);
    }, 500);
  };
  const mode = userr?.user?.user?.mode;
  useEffect(() => {
    if (mode === "dark") {
      document.body.style.backgroundColor = "#000000";
    } else {
      document.body.style.backgroundColor = "#ffffff";
    }
  }, [mode]);

  return (
    <>
      <header
        className={` ${mode} dark:bg-darkbg fixed top-0 w-full bg-white z-50`}
      >
        <ToastContainer />

        <div className="dark:bg-darkbg p-2 m-auto z-50 flex justify-start px-10 md:justify-between items-center">
          <div className="flex dark:bg-darkbg z-50 mr-2 w-full sm:w-full md:w-fit justify-center items-center">
            <div>
              <Link href="/home" className="text-sky-600 w-10 h-10 block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  data-supported-dps="24x24"
                  fill="currentColor"
                  class="mercado-match"
                  width="44"
                  height="42"
                  focusable="false"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
              </Link>
            </div>
            <div className="w-full md:w-fit  ml-2 relative flex items-center">
              <span className="absolute left-3">
                <IoMdSearch />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onFocus={() => setFocus(true)}
                onBlur={handelOnBlur}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full md:w-fit pr-4 h-10 bg-input-bg border border-gray-300 rounded text-black focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          <nav className="lg:w-2/3 dark:bg-darkbg py-2 md:w-3/5 flex fixed sm:relative justify-center bottom-0 left-0 w-full md:justify-end z-50 bg-white md:top-0">
            <ul className="flex items-center w-full justify-around">
              <Link
                href="/home"
                className={`${
                  currentPath === undefined && "active w-fit"
                } text-black relative dark:text-darkmaintext hover:opacity-100 flex flex-col items-center justify-center opacity-70  duration-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  data-supported-dps="24x24"
                  fill="currentColor"
                  class="mercado-match"
                  width="24"
                  height="24"
                  focusable="false"
                >
                  <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7z"></path>
                </svg>
                <span className="sm:hidden md:block text-sm md:text-base">
                  Home
                </span>
              </Link>
              <Link
                href="/home/network"
                onClick={() => setConnections(0)}
                className={`${
                  currentPath === "network" && "active"
                } text-black relative dark:text-darkmaintext hover:opacity-100 flex flex-col items-center justify-center opacity-70 duration-300`}
              >
                {connections > 0 && (
                  <span className="text-white text-xs w-5 h-5 rounded-full flex justify-center absolute top-[-2px] left-[38px] sm:left-4 md:left-[45px] p-1 items-center bg-[#cb112d]">
                    {connections}
                  </span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  data-supported-dps="24x24"
                  fill="currentColor"
                  class="mercado-match"
                  width="24"
                  height="24"
                  focusable="false"
                >
                  <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
                </svg>
                <span className="text-sm md:text-base sm:hidden md:block">
                  MY Network
                </span>
              </Link>
              <Link
                href="/home/jobs"
                className={`${
                  currentPath === "jobs" && "active"
                } text-black relative dark:text-darkmaintext hover:opacity-100 flex flex-col items-center justify-center opacity-70  duration-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  data-supported-dps="24x24"
                  fill="currentColor"
                  class="mercado-match"
                  width="24"
                  height="24"
                  focusable="false"
                >
                  <path d="M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm10 9a4 4 0 003-1.38V17a3 3 0 01-3 3H5a3 3 0 01-3-3v-4.38A4 4 0 005 14z"></path>
                </svg>
                <span className="text-sm md:text-base sm:hidden md:block">
                  Jobs
                </span>
              </Link>
              <Link
                href="/home/messaging"
                onClick={() => setNewMessage(0)}
                className={`${
                  currentPath === "messaging" && "active"
                } text-black relative dark:text-darkmaintext hover:opacity-100 flex flex-col items-center justify-center opacity-70  duration-300`}
              >
                {newMessage > 0 && (
                  <span className="text-white text-xs w-5 h-5 rounded-full flex justify-center absolute top-[-2px] left-[38px] sm:left-4 md:left-[45px] p-1 items-center bg-[#cb112d]">
                    {newMessage}
                  </span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  data-supported-dps="24x24"
                  fill="currentColor"
                  class="mercado-match"
                  width="24"
                  height="24"
                  focusable="false"
                >
                  <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                </svg>
                <span className="text-sm md:text-base sm:hidden md:block">
                  Messaging
                </span>
              </Link>
              {/* <Link
                href="/home/notifications"
                className={`${
                  currentPath === "notifications" && "active"
                } text-black relative dark:text-darkmaintext hover:opacity-100  flex flex-col items-center justify-center opacity-70  duration-300`}
              >
                {(newMessage > 0 || connections > 0) && (
                  <span className="text-white text-xs w-5 h-5 rounded-full flex justify-center absolute top-[-2px] left-[38px] sm:left-4 md:left-[45px] p-1 items-center bg-[#cb112d]">
                    {newMessage + connections}
                  </span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  data-supported-dps="24x24"
                  fill="currentColor"
                  class="mercado-match"
                  width="24"
                  height="24"
                  focusable="false"
                >
                  <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
                </svg>
                <span className="text-sm md:text-base sm:hidden md:block">
                  Notifications
                </span>
              </Link> */}
              <button
                onClick={() => setShowMenu(!showMenu)} // Toggle the menu
                className=" relative cursor-pointer"
              >
                <div className="flex flex-col justify-center items-center">
                  <Image
                    src={userr?.user?.user?.profileImage || userImage}
                    alt="user"
                    className="rounded-full w-6 h-6 mx-auto"
                    width={1500}
                    height={1500}
                  />

                  <span className="flex sm:hidden dark:text-darkmaintext md:flex text-sm md:text-base text-black items-center  opacity-70 hover:opacity-100 ">
                    Me
                    <VscTriangleDown />
                  </span>
                </div>
                {showMenu && (
                  <div className="menu-container absolute shadow-white dark:shadow-black right-0 bottom-16 sm:top-14 h-fit dark:bg-darkbg dark:border-darkborder bg-white border border-gray-300 rounded-md shadow-lg w-64 p-3">
                    <div className="flex justify-start items-center mb-4">
                      <div>
                        <Image
                          src={userr?.user?.user?.profileImage || userImage}
                          alt="user"
                          className="rounded-full w-10 h-10 mx-auto"
                          width={1500}
                          height={1500}
                        />
                      </div>
                      <div className="flex flex-col ml-2 dark:text-darkmaintext">
                        <h5 className="font-semibold text-base">{`${userr?.user?.user?.firstName} ${userr?.user?.user?.lastName}`}</h5>
                        <span>{userr?.user?.user?.title}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <Link
                        href={`/home/profile/${userr?.user?.user?._id}`}
                        className="text-blue-600 w-full block duration-300 my-3 rounded-full font-bold border hover:bg-blue-600 hover:text-white border-solid border-blue-600"
                      >
                        View Profile
                      </Link>
                      {mode === "dark" ? (
                        <button
                          onClick={() => handleMode("light")}
                          className="my-3 flex text-3xl"
                        >
                          <MdSunny className=" text-yellow-500" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMode("dark")}
                          className="my-3 flex text-3xl"
                        >
                          <FaMoon className="text-black dark:text-darkmaintext" />
                        </button>
                      )}

                      <button
                        onClick={handleSignOut}
                        className="hover:underline dark:text-darkmaintext"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </button>
            </ul>
          </nav>
        </div>
      </header>
      {focus && (
        <div className="h-full top-20 fixed w-full z-50 bg-black bg-opacity-70 p-6">
          {usersToSearch?.map((item, i) => (
            <Link
              href={`/home/profile/${item?._id}`}
              key={i}
              className="w-full flex items-center justify-start "
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
              <div className="font-semibold flex flex-col items-center justify-center text-base leading-normal text-white">
                <span className="ml-3">
                  {item?.firstName} {item?.lastName}
                </span>
                <span>{item?.title}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Header;
