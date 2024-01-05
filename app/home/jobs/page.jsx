"use client";
import Link from "next/link";
import { useState } from "react";
import userImage from "../../../public/images/user.svg";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

const Page = () => {
  const [jobsArray, setJobsArray] = useState([
    {
      title: "Software Engineer",
      provider: "Tech Co.",
      date: "January 15, 2024",
      place: "City A, Country X",
      image: userImage, // Replace with the actual image path
    },
    {
      title: "Data Analyst",
      provider: "Data Analytics Inc.",
      date: "February 1, 2024",
      place: "City B, Country Y",
      image: userImage, // Replace with the actual image path
    },
    {
      title: "Marketing Specialist",
      provider: "Marketing Solutions Ltd.",
      date: "March 10, 2024",
      place: "City C, Country Z",
      image: userImage, // Replace with the actual image path
    },
    {
      title: "Software Engineer",
      provider: "Tech Co.",
      date: "January 15, 2024",
      place: "City A, Country X",
      image: userImage, // Replace with the actual image path
    },
    {
      title: "Data Analyst",
      provider: "Data Analytics Inc.",
      date: "February 1, 2024",
      place: "City B, Country Y",
      image: userImage, // Replace with the actual image path
    },
    {
      title: "Marketing Specialist",
      provider: "Marketing Solutions Ltd.",
      date: "March 10, 2024",
      place: "City C, Country Z",
      image: userImage, // Replace with the actual image path
    },
  ]);

  const handleDelete = (index) => {
    const updatedJobsArray = [...jobsArray];
    updatedJobsArray.splice(index, 1);
    setJobsArray(updatedJobsArray);
  };

  return (
    <div className="container w-full  flex justify-center flex-col items-center mt-20 ">
      <div className="border border-slate-300 border-solid p-3 w-1/2 rounded-md">
        {jobsArray.map((job, index) => (
          <Link
            href=""
            key={index}
            className="bg-white relative p-4  rounded-md shadow-md mb-4 flex items-start"
          >
            <div className="mr-4">
              <Image
                src={job.image}
                alt={`${job.provider} Logo`}
                width={40}
                height={40}
                className=""
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
              <p className="text-gray-600">{job.provider}</p>
              <p className="text-gray-600">{job.date}</p>
              <p className="text-gray-600">{job.place}</p>
            </div>
            <button
              onClick={() => handleDelete(index)}
              className="text-2xl font-bold absolute top-7 right-2 "
            >
              <IoMdClose />
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
