"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { addJob, getAllJobs } from "@/app/services/apiHandler";
import { useSelector } from "react-redux";

const Page = () => {
  const user = useSelector((state) => state.auth?.user?.user);
  const [show, setShow] = useState(false);
  const [jobsArray, setJobsArray] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const handleGetJobs = async () => {
    try {
      const res = await getAllJobs();
      if (res.status === 200) {
        setJobsArray(res.data);
      }
    } catch (e) {
      throw e;
    }
  };
  const handleAddJob = async () => {
    if (isValidInput()) {
      setNewJob({
        title: "",
        date: "",
        place: "",
        description: "",
      });
      const job = {
        title: newJob.title,
        providerId: user?._id,
        providerName: user?.firstName + user?.lastName,
        providerTitle: "front",
        date: newJob.date,
        place: newJob.place,
        description: newJob?.description,
        providerImage: user?.profileImage,
      };
      setSpinner(true);
      try {
        const res = await addJob(job);
        if (res.status === 201) {
          getAllJobs();
          setSpinner(false);
        }
      } catch (err) {
        setSpinner(false);

        throw err;
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };
  useEffect(() => {
    handleGetJobs();
  }, [handleAddJob]);
  const [newJob, setNewJob] = useState({
    title: "",
    date: "",
    place: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const isValidInput = () => {
    return (
      newJob.title.trim() !== "" &&
      newJob.date.trim() !== "" &&
      newJob.place.trim() !== "" &&
      newJob.description.trim() !== ""
    );
  };

  const handleShowForm = () => {
    setShow(true);
  };
  return (
    <div className=" w-full px-6 lg:px-28 flex flex-col   justify-center relative items-start mt-32">
      {spinner && (
        <div
          className={`border-4 my-2 border-solid mx-auto ${
            spinner ? "opacity-1" : "opacity-0"
          } border-gray-400 border-t-blue-500 rounded-full w-8 h-8 animate-spin`}
        ></div>
      )}
      <div className="w-full relative flex flex-col md:flex-row  justify-center items-start">
        <button
          className="md:hidden text-white bg-blue-500 hover:bg-blue-600 mx-auto py-2 px-4 mb-3 rounded-md duration-300"
          onClick={handleShowForm}
        >
          Add a job
        </button>
        <div className="border flex flex-col dark:bg-darkbg border-slate-300 border-solid p-3 w-full md:w-1/2 lg:w-2/3 rounded-md">
          {jobsArray?.length > 0 ? (
            jobsArray.map((job, index) => (
              <Link href={`/home/jobs/${job?._id}`} key={index}>
                <div className="bg-white relative p-4 dark:bg-darkbg rounded-md  mb-4 flex flex-col items-start">
                  <div className="mr-4 flex items-center">
                    <Image
                      src={job.providerImage}
                      alt={`${job.provider} Logo`}
                      width={40}
                      height={40}
                      className=""
                    />
                    <div className="flex flex-col ml-3">
                      <p className="text-gray-600 dark:text-darkmaintext">
                        {job.providerName}
                      </p>
                      <p className="text-gray-600 dark:text-darkmaintext">
                        {job.providerTitle}
                      </p>
                    </div>
                  </div>
                  <div className="dark:text-darksecondtext">
                    <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
                    <p className="text-gray-600 dark:text-darksecondtext">
                      {job.date}
                    </p>
                    <p className="text-gray-600 dark:text-darksecondtext">
                      {job.place}
                    </p>
                    <p className="text-gray-600 dark:text-darksecondtext">
                      {job.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <span className="dark:text-darkmaintext">Not jobs yet</span>
          )}
        </div>
        <div className="mb-4 dark:bg-darkbg ml-3 p-4 hidden md:flex flex-col w-1/3 bg-white rounded-md shadow-md">
          <label className="block dark:text-darkmaintext text-xl font-semibold mb-2">
            Add New Job
          </label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newJob.title}
            onChange={handleInputChange}
            className="border dark:bg-darkbg dark:text-darksecondtext border-gray-300 rounded-md p-2 mb-2"
          />

          <input
            type="date"
            name="date"
            placeholder="Date"
            value={newJob.date}
            onChange={handleInputChange}
            className="border dark:bg-darkbg dark:text-darksecondtext border-gray-300 rounded-md p-2 mb-2"
          />
          <input
            type="text"
            name="place"
            placeholder="Place"
            value={newJob.place}
            onChange={handleInputChange}
            className="border dark:bg-darkbg dark:text-darksecondtext border-gray-300 rounded-md p-2 mb-2"
          />

          <textarea
            type="description"
            name="description"
            placeholder="Description"
            value={newJob.description}
            onChange={handleInputChange}
            className="border dark:bg-darkbg dark:text-darksecondtext border-gray-300 rounded-md p-2 mb-2"
          />
          <button
            onClick={handleAddJob}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Add Job
          </button>
        </div>
        {show && (
          <div className="mb-4 p-3 flex flex-col w-full h-fit absolute inset-0 dark:bg-darkbg  bg-white rounded-md shadow-md">
            <button
              onClick={() => setShow(false)}
              className="text-white bg-red-500 hover:bg-red-600 w-fit mx-auto py-2 px-4 mb-3 rounded-md duration-300"
            >
              close
            </button>
            <label className="block text-xl dark:text-darkmaintext font-semibold mb-2">
              Add New Job
            </label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newJob.title}
              onChange={handleInputChange}
              className="border dark:bg-darkbg dark:text-darksecondtext border-gray-300 rounded-md p-2 mb-2"
            />

            <input
              type="date"
              name="date"
              placeholder="Date"
              value={newJob.date}
              onChange={handleInputChange}
              className="border dark:bg-darkbg dark:text-darksecondtext border-gray-300 rounded-md p-2 mb-2"
            />
            <input
              type="text"
              name="place"
              placeholder="Place"
              value={newJob.place}
              onChange={handleInputChange}
              className="border dark:bg-darkbg dark:text-darksecondtext border-gray-300 rounded-md p-2 mb-2"
            />

            <textarea
              type="description"
              name="description"
              placeholder="Description"
              value={newJob.description}
              onChange={handleInputChange}
              className="border dark:bg-darkbg dark:text-darksecondtext border-gray-300 rounded-md p-2 mb-2"
            />
            <button
              onClick={handleAddJob}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Add Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
