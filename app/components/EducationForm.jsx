"use client";

import { useEffect, useState } from "react";
import { UpdateEducation, addEducation } from "../services/apiHandler";
import { useDispatch } from "react-redux";
import { login } from "../rtk/authSlice";

const EducationForm = ({ show, update, setShow, id }) => {
  console.log(id);
  const dispatch = useDispatch();
  const [spinner, setSpinner] = useState(false);
  console.log(update);
  const [education, setEducation] = useState({
    id: 1,
    institution: "",
    department: "",
    startDate: "",
    endDate: "",
    grade: "",
  });

  const handleChange = (e) => {
    setEducation({
      ...education,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    setEducation({
      id: 1,
      institution: "",
      department: "",
      startDate: "",
      endDate: "",
      grade: "",
    });
  }, [show]);
  const handleEducationSubmit = async () => {
    setSpinner(true);
    const formData = new FormData();
    formData.set("institution", education.institution);
    formData.set("department", education.department);
    formData.set("startDate", education.startDate);
    formData.set("endDate", education.endDate);
    formData.set("grade", education.grade);

    try {
      const res = await addEducation(formData);
      if (res.status === 200) {
        dispatch(login(res.data));
        typeof window !== "undefined" &&
          localStorage.setItem("user", JSON.stringify(res.data));
        setSpinner(false);
        setShow(false);
      }
    } catch (err) {
      throw err;
    }
  };
  const handleEducationUpdate = async () => {
    setSpinner(true);
    const formData = new FormData();
    formData.set("institution", education.institution);
    formData.set("department", education.department);
    formData.set("startDate", education.startDate);
    formData.set("endDate", education.endDate);
    formData.set("grade", education.grade);

    try {
      const res = await UpdateEducation(formData, id);
      if (res.status === 200) {
        dispatch(login(res.data));
        typeof window !== "undefined" &&
          localStorage.setItem("user", JSON.stringify(res.data));
        setSpinner(false);
        setShow(false);
      }
    } catch (err) {
      throw err;
    }
  };
  return (
    <div className="container mx-auto mt-2">
      <form className="max-w-md mx-auto bg-white dark:bg-darkbg p-2 ">
        <div className="mb-4">
          <label
            className="block dark:text-darksecondtext text-gray-700 text-sm font-bold mb-2"
            htmlFor="institution"
          >
            Institution
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={education.institution}
            onChange={handleChange}
            className="w-full border rounded dark:text-darkmaintext dark:bg-darkbg py-2 px-3 border-slate-300 border-solid focus:border-blue-600 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-darksecondtext text-sm font-bold mb-2"
            htmlFor="department"
          >
            Department
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={education.department}
            onChange={handleChange}
            className="w-full border rounded dark:text-darkmaintext dark:bg-darkbg py-2 px-3 border-slate-300 border-solid focus:border-blue-600 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-darksecondtext text-sm font-bold mb-2"
            htmlFor="startDate"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={education.startDate}
            onChange={handleChange}
            className="w-full border rounded dark:text-darkmaintext dark:bg-darkbg py-2 px-3 border-slate-300 border-solid focus:border-blue-600 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-darksecondtext text-sm font-bold mb-2"
            htmlFor="endDate"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={education.endDate}
            onChange={handleChange}
            className="w-full border rounded dark:text-darkmaintext dark:bg-darkbg py-2 px-3 border-slate-300 border-solid focus:border-blue-600 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4 ">
          <label
            className="block text-gray-700 dark:text-darksecondtext text-sm font-bold mb-2"
            htmlFor="grade"
          >
            Grade
          </label>
          <input
            type="text"
            id="grade"
            name="grade"
            value={education.grade}
            onChange={handleChange}
            className="w-full border rounded dark:text-darkmaintext dark:bg-darkbg py-2 px-3 border-slate-300 border-solid focus:border-blue-600 focus:outline-none"
            required
          />
        </div>
      </form>
      <div className="w-full justify-end flex">
        <div
          className={`border-4 mt-3 border-solid mr-4 ${
            spinner ? "opacity-1" : "opacity-0"
          } border-gray-400 border-t-blue-500  rounded-full w-8 h-8 animate-spin`}
        ></div>
        {update === "add" ? (
          <button
            onClick={handleEducationSubmit}
            disabled={
              education.institution === "" ||
              education.startDate === "" ||
              education.endDate === "" ||
              education.grade === "" ||
              education.department === ""
            }
            className={`px-3 py-1 mt-3 duration-300 ${
              education.institution === "" ||
              education.startDate === "" ||
              education.endDate === "" ||
              education.grade === "" ||
              education.department === ""
                ? "text-black dark:text-darksecondtext"
                : "text-white bg-blue-600  rounded-full "
            }`}
          >
            Add
          </button>
        ) : (
          <button
            onClick={handleEducationUpdate}
            disabled={
              education.institution === "" ||
              education.startDate === "" ||
              education.endDate === "" ||
              education.grade === "" ||
              education.department === ""
            }
            className={`px-3 py-1 mt-3 duration-300 ${
              education.institution === "" ||
              education.startDate === "" ||
              education.endDate === "" ||
              education.grade === "" ||
              education.department === ""
                ? "text-black dark:text-darksecondtext"
                : "text-white bg-blue-600  rounded-full "
            }`}
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default EducationForm;
