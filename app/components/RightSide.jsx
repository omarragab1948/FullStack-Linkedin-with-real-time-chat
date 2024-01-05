import React from "react";

const RightSide = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      title: "Web Developer",
      image: "https://placekitten.com/80/80", // Replace with the actual image URL
    },
    {
      id: 2,
      name: "Jane Smith",
      title: "UI/UX Designer",
      image: "https://placekitten.com/81/80", // Replace with the actual image URL
    },
    {
      id: 3,
      name: "Bob Johnson",
      title: "Software Engineer",
      image: "https://placekitten.com/82/80", // Replace with the actual image URL
    },
  ];

  return (
    <div className="lg:flex w-1/4 hidden justify-center flex-col items-center sticky top-24 h-96 rounded-lg px-3 py-4 border border-slate-300 border-solid ">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex  items-start justify-center w-full mb-4"
        >
          <img
            src={user.image}
            alt={user.name}
            className="w-14 h-14 rounded-full mb-2"
          />
          <div className="flex flex-col w-4/5 ml-3 justify-start items-start">
            <p className="text-center text-gray-800 font-semibold text-sm">
              {user.name}
            </p>
            <p className="text-center text-gray-500 text-xs">{user.title}</p>
            <button className="mt-3 py-1 px-5 border border-solid border-slate-800 rounded-full">
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RightSide;
