import {
  Avatar,
  Button,
  FloatingLabel,
  Pagination,
  Spinner,
} from "flowbite-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { FaLongArrowAltRight } from "react-icons/fa";
import { RiTimeFill } from "react-icons/ri";
import { Link, useLoaderData } from "react-router-dom";

import { toast } from "react-toastify";

const Queries = () => {
  const [serverQueriesData, queriesCount] = useLoaderData();
  const [queriesData, setQueriesData] = useState(serverQueriesData.result);
  const [paginationDataLoading, setPaginationDataLoading] = useState(false);
  const [searchDataLoading, setSearchDataLoading] = useState(false);
  const [layoutCol, setLayoutCol] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const itemPerPage = 9;

  const [pagesCount, setPagesCount] = useState(
    Math.ceil(
      (queriesCount.count < itemPerPage
        ? itemPerPage
        : queriesCount.count ?? itemPerPage) / itemPerPage
    )
  );

  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page) => {
    setPaginationDataLoading(true);
    const skip = itemPerPage * (page - 1);
    if (searched && searchQuery !== "") {
      fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/queries?search=${searchQuery}&skip=${skip}&limit=${itemPerPage}`
      )
        .then((res) => res.json())
        .then((data) => {
          setQueriesData(data.result);
          setPaginationDataLoading(false);
        });
    } else {
      fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/queries?skip=${skip}&limit=${itemPerPage}`
      )
        .then((res) => res.json())
        .then((data) => {
          setQueriesData(data.result);
          setPaginationDataLoading(false);
        });
    }

    setCurrentPage(page);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchQuery === "") {
      toast.error("Enter a Search Text First!");
      return;
    }

    setSearchDataLoading(true);
    const res = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/queries?search=${searchQuery}&limit=${itemPerPage}`
    );
    const data = await res.json();
    setQueriesData(data.result);
    setPagesCount(Math.ceil((data.count ?? 0) / itemPerPage));
    setSearched(true);
    setSearchDataLoading(false);
  };

  return (
    <div className="pb-10 dark:text-gray-100">
      <Helmet>
        <title>Queries List | Alternative Seek</title>
      </Helmet>
      <h3 className="mb-8 text-2xl font-lato font-semibold p-5 w-full dark:bg-gray-800 text-center border-b-2 border-gray-400 dark:border-gray-500">
        All Queries List
      </h3>

      {/* Extra Options */}
      <div className="flex justify-between items-center flex-col md:flex-row mb-10 mx-1 sm:mx-5 gap-10">
        {/* Change Layout */}
        <div className="gap-4 items-center text-xl hidden md:flex">
          Layout:{" "}
          <label className="cursor-pointer">
            <div
              className={`w-10 h-max min-h-[42px] p-0.5 gap-[1px] grid-cols-3 grid *:bg-gray-500 ${
                layoutCol == 3 ? "bg-blue-400" : "bg-gray-200"
              }`}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
            <input
              type="radio"
              name="layout"
              value={3}
              onChange={(e) => setLayoutCol(e.target.value)}
              className="hidden"
            />
          </label>
          <label className="cursor-pointer">
            <div
              className={`w-10 h-max min-h-[42px] p-0.5 gap-[1px] grid-cols-2 grid *:bg-gray-500 ${
                layoutCol == 2 ? "bg-blue-400" : "bg-gray-200"
              }`}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
            <input
              type="radio"
              name="layout"
              value={2}
              onChange={(e) => setLayoutCol(e.target.value)}
              className="hidden"
            />
          </label>
          <label className="cursor-pointer">
            <div
              className={`w-10 h-max min-h-[42px] p-0.5 gap-[1px] grid-cols-1 grid *:bg-gray-500 ${
                layoutCol == 1 ? "bg-blue-400" : "bg-gray-200"
              }`}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
            <input
              type="radio"
              name="layout"
              value={1}
              onChange={(e) => setLayoutCol(e.target.value)}
              className="hidden"
            />
          </label>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-5">
          <Spinner
            aria-label="Medium sized spinner"
            size="md"
            className={searchDataLoading ? "visible" : "invisible"}
          />
          <FloatingLabel
            variant="standard"
            label="Enter Your Search Text"
            helperText="You can Search Query by Product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button color="blue" type="submit">
            Search
          </Button>
        </form>
      </div>

      {/* Queries List */}
      {searched && queriesData.length === 0 ? (
        <div className="text-center my-5 font-semibold italic text-xl">
          No Search Result Found!
        </div>
      ) : (
        <div
          className={`grid gap-5 justify-evenly mb-8 ${
            layoutCol == 1
              ? "grid-cols-1"
              : layoutCol == 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-3"
          } `}
        >
          {queriesData.map((item) => (
            <div key={item._id}>
              {/* Primary Layout */}
              <div
                className={`rounded-md p-2 border-2 border-gray-700 dark:bg-gray-700 dark:text-gray-200 relative ${
                  layoutCol == 1
                    ? "md:hidden md:h-[620px] lg:h-[600px]"
                    : "md:h-[700px] lg:h-[650px]"
                }`}
              >
                <div
                  className={`w-full ${
                    layoutCol == 2
                      ? "md:h-[285px]"
                      : layoutCol == 3
                      ? "md:h-[180px]"
                      : ""
                  } mb-4 overflow-hidden flex justify-center items-center bg-slate-400 dark:bg-slate-600`}
                >
                  <img
                    src={item.productImageURL}
                    alt={item.productName}
                    className={`w-full ${
                      layoutCol == 2
                        ? "md:h-[285px]"
                        : layoutCol == 3
                        ? "md:h-[180px]"
                        : ""
                    } object-contain hover:scale-125 transition-[transform] duration-300`}
                  />
                </div>
                <p className="text-xl font-lato font-semibold text-center mb-4">
                  {item.queryTitle}
                </p>
                <h3>
                  <span className="font-semibold">Product:</span>{" "}
                  {item.productName}
                </h3>
                <p>
                  <span className="font-semibold">Brand:</span>{" "}
                  {item.productBrand}
                </p>
                <p>
                  <span className="font-semibold">Recommendations:</span>{" "}
                  {item.recommendationCount}
                </p>
                <p className="pl-4 border-l-4 border-gray-300 my-3">
                  {item.boycottingReasonDetails}
                </p>
                <p className="flex gap-2 items-center mb-5">
                  <RiTimeFill /> {new Date(item.dateTime).toLocaleString()}
                </p>

                <div className="flex items-center justify-center gap-2 font-semibold text-lg mb-4">
                  <Avatar img={item.userImage} rounded />
                  <p>{item.userName}</p>
                </div>

                <div className="flex justify-center relative md:absolute md:bottom-4 left-[50%] -translate-x-[50%] w-max">
                  <Link
                    to={`/query-details/${item._id}`}
                    className="flex items-center"
                  >
                    <Button color={"blue"}>
                      View Recommendations{" "}
                      <FaLongArrowAltRight className="ml-3 text-2xl" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Secondary Layout */}
              <div
                className={`flex gap-6 rounded-md p-4 border-2 border-gray-700 dark:bg-gray-700 dark:text-gray-200 relative ${
                  layoutCol == 1 ? "hidden md:flex" : "hidden"
                }`}
              >
                <div
                  className={`w-1/3 mb-4 overflow-hidden flex justify-center items-center bg-slate-400 dark:bg-slate-600`}
                >
                  <img
                    src={item.productImageURL}
                    alt={item.productName}
                    className="w-full hover:scale-125 transition-[transform] duration-300"
                  />
                </div>
                <div>
                  <p className="text-xl font-lato font-semibold text-center mb-4">
                    {item.queryTitle}
                  </p>
                  <h3>
                    <span className="font-semibold">Product:</span>{" "}
                    {item.productName}
                  </h3>
                  <p>
                    <span className="font-semibold">Brand:</span>{" "}
                    {item.productBrand}
                  </p>
                  <p>
                    <span className="font-semibold">Recommendations:</span>{" "}
                    {item.recommendationCount}
                  </p>
                  <p className="pl-4 border-l-4 border-gray-300 my-3">
                    {item.boycottingReasonDetails}
                  </p>
                  <p className="flex gap-2 items-center mb-5">
                    <RiTimeFill /> {new Date(item.dateTime).toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                      <Avatar img={item.userImage} rounded />
                      <p>{item.userName}</p>
                    </div>
                    <Link
                      to={`/query-details/${item._id}`}
                      className="flex items-center"
                    >
                      <Button color={"blue"}>
                        View Recommendations{" "}
                        <FaLongArrowAltRight className="ml-3 text-2xl" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex overflow-x-auto sm:justify-center items-center gap-4">
        <Spinner
          aria-label="Medium sized spinner"
          size="md"
          className={paginationDataLoading ? "visible" : "invisible"}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={pagesCount}
          onPageChange={onPageChange}
          showIcons
        />
        <Spinner
          aria-label="Medium sized spinner"
          size="md"
          className={"invisible"}
        />
      </div>
    </div>
  );
};

export default Queries;
