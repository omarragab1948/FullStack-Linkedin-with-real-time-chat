"use client";
import { getJob } from "@/app/services/apiHandler";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [job, setJob] = useState(null); // State to store job details
  const pathname = usePathname(); // Extract job ID from the pathname
  const jobId = pathname.split("/")[3];

  console.log(job);
  const fetchJobDetails = async () => {
    try {
      const response = await getJob(jobId); // Fetch job details using API function
      if (response.status === 200) {
        setJob(response.data?.job); // Set job details in the state
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  useEffect(() => {
    // Function to fetch job details based on ID

    fetchJobDetails(); // Call the function on component mount
  }, []); // Dependency array is empty to run this effect only once

  const handleApply = () => {
    setPopupOpen(true);
  };

  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    setCvFile(file);
  };

  const handleSubmitApplication = () => {
    toast.success("Application applied successfully");
    setPopupOpen(false);
  };

  if (!job) {
    return null; // Return null or a loading indicator while fetching job details
  }

  return (
    <>
      <div className=" w-4/5 md:w-1/2 p-4 rounded-md dark:bg-darkbg shadow-xl mt-24 mx-auto">
        <div className=" relative p-4 rounded-md  mb-4 flex flex-col items-start">
          <div className="mr-4 flex items-center">
            <Image
              src={job.providerImage}
              alt={`${job.provider} Logo`}
              width={40}
              height={40}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex flex-col ml-3">
              <p className="text-lg font-semibold dark:text-darkmaintext">
                {job.providerName}
              </p>
              <p className="text-gray-600  dark:text-darksecondtext text-lg font-semibold">
                {job.providerTitle}
              </p>
            </div>
          </div>
          <div className="pl-4">
            <h2 className="text-2xl font-semibold mb-2 dark:text-darksecondtext">
              {job.title}
            </h2>
            <p className="text-gray-600 dark:text-darksecondtext">{job.date}</p>
            <p className="text-gray-600 dark:text-darksecondtext">
              {job.place}
            </p>
            <p className="text-gray-600 dark:text-darksecondtext">
              {job.description}
            </p>
          </div>
          <button
            className="bg-blue-500 text-white p-2 mx-auto w-24 rounded-md mt-4"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>

        {/* Popup for CV upload and application */}
        {isPopupOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-50  bg-black bg-opacity-75 flex justify-center items-center">
            <div className="bg-white dark:bg-darkbg  w-4/5 md:w-1/2 p-8 rounded-md shadow-md">
              <h2 className="text-xl dark:text-darkmaintext font-semibold mb-4">
                Apply for {job.title}
              </h2>

              {/* Input for CV upload */}
              <input
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={handleCvUpload}
                className="mb-4"
              />

              {/* Submit button */}
              <button
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 duration-300"
                onClick={handleSubmitApplication}
              >
                Submit Application
              </button>

              {/* Close button */}
              <button
                className="text-white ml-4 p-2 rounded-md cursor-pointer bg-red-500 hover:bg-red-600 duration-300"
                onClick={() => setPopupOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
