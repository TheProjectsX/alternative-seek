import { Helmet } from "react-helmet";
import bannerImage from "../assets/image_02.jpg";
import { Button } from "flowbite-react";
import { Link, useLoaderData } from "react-router-dom";
import { RiTimeFill } from "react-icons/ri";
import { FaLongArrowAltRight } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";

// Sweet Alert
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useState } from "react";

const MyQueries = () => {
  const mainItemsData = useLoaderData();
  if (mainItemsData === null) return;
  const [queriesData, setQueriesData] = useState(mainItemsData);

  // Delete Item
  const handleDeleteItem = (id) => {
    Swal.fire({
      title: "Are you Sure you want to Delete?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/queries/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        const serverResponse = await res.json();
        if (serverResponse.success) {
          setQueriesData(queriesData.filter((item) => item._id !== id));
          toast.success("Item Deleted Successfully!");
        } else {
          toast.error(serverResponse.message);
        }
      }
    });
  };

  return (
    <div className="pb-10 dark:text-gray-100 pt-5">
      <Helmet>
        <title>My Queries | Alternative Seek</title>
      </Helmet>

      {/* Banner */}
      <div className="relative mb-8">
        <img src={bannerImage} alt="Banner Image" className="w-full" />
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-40 "></div>
        <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center flex-col text-center text-white">
          <h4 className="text-lg sm:text-3xl font-bold font-lato sm:mb-3">
            Can't Find Alternative?
          </h4>
          <p className="sm:text-lg mb-2 sm:mb-4 font-semibold">
            Add new Query and Get Best Recommendations!
          </p>
          <Link to="/create-query">
            <Button color="blue">Add New Query</Button>
          </Link>
        </div>
      </div>

      {/* Queries Section */}
      <div>
        <h3 className="mb-8 text-2xl font-lato font-semibold p-5 w-full dark:bg-gray-800 text-center border-b-2 border-gray-400 dark:border-gray-500">
          My Queries
        </h3>

        <div className="flex flex-wrap gap-5 justify-evenly">
          {queriesData.length === 0 ? (
            <div className="py-5 flex flex-col items-center gap-5 text-center text-2xl font-semibold">
              <span>No Queries to Show. Add one Now!</span>
              <Link to="/create-query">
                <Button color="blue">Add new Query</Button>
              </Link>
            </div>
          ) : (
            queriesData.map((item) => (
              <div
                key={item._id}
                className={`flex flex-col md:flex-row md:w-full gap-6 rounded-md p-4 border-2 border-gray-700 dark:bg-gray-700 dark:text-gray-200 relative`}
              >
                <div
                  className={`w-full md:w-1/3 mb-4 overflow-hidden flex justify-center items-center bg-slate-400 dark:bg-slate-600`}
                >
                  <img
                    src={item.productImageURL}
                    alt={item.productName}
                    className="w-full hover:scale-125 transition-[transform] duration-300"
                  />
                </div>
                <div>
                  <p className="text-xl font-lato font-semibold mb-4">
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

                  <div className="flex flex-wrap gap-5 items-center justify-center">
                    <Link
                      to={`/edit-query/${item._id}`}
                      className="flex items-center gap-3"
                    >
                      <Button color="purple">
                        <span className="flex items-center gap-3">
                          Edit <MdEdit className="text-2xl" />
                        </span>
                      </Button>
                    </Link>
                    <Button
                      color="red"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      <span className="flex items-center gap-3">
                        Delete <MdDelete className="text-2xl" />
                      </span>
                    </Button>
                    <Link to={`/query-details/${item._id}`}>
                      <Button color={"blue"}>
                        <span className="flex items-center gap-3">
                          {" "}
                          View Details
                          <FaLongArrowAltRight className="text-2xl" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyQueries;
