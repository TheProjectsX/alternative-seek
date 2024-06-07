import { Button, Table } from "flowbite-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";

// Sweet Alert
import Swal from "sweetalert2";

const MyRecommendations = () => {
  const mainItemsData = useLoaderData();
  if (mainItemsData === null) return;
  const [recommendationsData, setRecommendationsData] = useState(mainItemsData);

  // Delete Item
  const handleDeleteItem = (id) => {
    Swal.fire({
      title: "Are you Sure you want to Delete?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/recommendations/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        const serverResponse = await res.json();
        if (serverResponse.success) {
          setRecommendationsData(
            recommendationsData.filter((item) => item._id !== id)
          );
          toast.success("Item Deleted Successfully!");
        } else {
          toast.error(serverResponse.message);
        }
      }
    });
  };
  return (
    <div className="pb-10 dark:text-gray-100">
      <Helmet>
        <title>My Recommendations | Alternative Seek</title>
      </Helmet>
      <h3 className="mb-8 text-2xl font-lato font-semibold p-5 w-full dark:bg-gray-800 text-center border-b-2 border-gray-400 dark:border-gray-500">
        My Recommendations
      </h3>

      {recommendationsData.length === 0 ? (
        <div className="text-center italic font-semibold py-5 text-2xl">
          No Items to Show!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Product name</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Reason</Table.HeadCell>
              <Table.HeadCell>Query Title</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {recommendationsData.map((item) => (
                <Table.Row
                  key={item._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item.productName}
                  </Table.Cell>
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.reason.substring(0, 40)}...</Table.Cell>
                  <Table.Cell>{item.queryProductName}</Table.Cell>
                  <Table.Cell>
                    <Button
                      color="red"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MyRecommendations;
