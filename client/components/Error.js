const Error = ({ error }) => {
  return (
    <div className="absolute h-1/2 w-full top-0 left-0 flex flex-col justify-center items-center">
      <div className="lg:min-w-[240px] py-2 px-4 sm:py-2 sm:px-24 rounded-md h-18 border-[1px] border-red-500 bg-red-400 opacity-50">
        {error}
      </div>
    </div>
  );
};

export default Error;
