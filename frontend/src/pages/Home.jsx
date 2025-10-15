import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword });

  // Ensure data.products exists
  const products = data?.products || [];

  return (
    <>
      {/* Header only on non-search pages */}
      {!keyword && <Header />}

      {/* Loading state */}
      {isLoading && <Loader />}

      {/* Error state */}
      {error && (
        <Message variant="danger">
          {error?.data?.message || error?.message || "Something went wrong"}
        </Message>
      )}

      {/* Products list */}
      {!isLoading && !error && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div className="flex justify-center flex-wrap mt-[2rem]">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))
            ) : (
              <p className="text-center mt-8">No products found.</p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
