"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import share from "@/public/images/shared-image.jpg";
import user from "@/public/images/user.svg";
import Image from "next/image";
import { getAllUsers } from "@/app/services/apiHandler";

const page = () => {
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

  return (
    <div className="container flex  mx-auto py-4 px-16 mt-20 ">
      <div className="w-1/5 flex flex-col border border-solid h-32 border-slate-300 py-4 px-3">
        <Link
          href=""
          className="flex items-center justify-between font-semibold opacity-70"
        >
          <div className="flex items-center opacity-70">
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
            <span className="ml-2">Connections</span>
          </div>
          <span>265</span>
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-center w-4/5 ml-4 border border-slate-300 border-solid p-3">
        {users?.map((item, i) => (
          <div className="w-1/4 flex flex-col m-2 items-center justify-center border border-slate-300 border-solid rounded-t-xl pb-2">
            <div className="w-full">
              <Image
                src={share}
                alt="user"
                width={1000}
                height={1000}
                className="rounded-t-xl w-full h-24 mx-auto"
              />
            </div>

            <div className="relative bottom-10  rounded-full ">
              <Image
                src={user}
                alt="user"
                className="rounded-full w-24 mx-auto"
              />
            </div>
            <div className="font-semibold flex justify-center relative bottom-6 text-base leading-normal text-black  opacity-90">
              <span>
                {item?.firstName} {item?.lastName}
              </span>
            </div>

            <div className="font-normal flex justify-center relative bottom-6 text-md leading-snug mt-1">
              Front-End
            </div>
            <button className="text-blue-600 rounded-full py-1 px-3 font-semibold duration-300 hover:bg-blue-600 hover:text-white border border-solid border-blue-600">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
