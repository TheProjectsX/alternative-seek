import { Button, Table } from "flowbite-react";
import { Helmet } from "react-helmet";
import { Link, useLoaderData } from "react-router-dom";

const RecommendationsForMe = () => {
  const recommendationsData = useLoaderData();
  return (
    <div className="pb-10 dark:text-gray-100">
      <Helmet>
        <title>Recommendations for Me | Alternative Seek</title>
      </Helmet>
      <h3 className="mb-8 text-2xl font-lato font-semibold p-5 w-full dark:bg-gray-800 text-center border-b-2 border-gray-400 dark:border-gray-500">
        Recommendations for Me
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
                    <Link to={`/query-details/${item.queryId}`}>
                      <Button color="blue">View Query</Button>
                    </Link>
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

export default RecommendationsForMe;
