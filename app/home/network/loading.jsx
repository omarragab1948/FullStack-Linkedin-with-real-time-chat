const loading = () => {
  return (
    <div className="w-full flex justify-center  dark:bg-black z-50 mt-80 items-center h-full absolute top-0 left-0 bg-white">
      <div
        className={`border-4 my-2 border-solid mr-3  border-gray-400 border-t-blue-500 rounded-full w-12 h-12 animate-spin`}
      ></div>
    </div>
  );
};

export default loading;
