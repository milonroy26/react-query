/* eslint-disable react/prop-types */
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react';

import { FaRegStar } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";


const retrieveProducts = async ({ queryKey }) => {
  const response = await axios.get(`http://localhost:3000/products?_page=${queryKey[1].page} &_per_page=6`);
  return response.data;
}

const ProductList = ({ onProductId, onEditProduct }) => {
  // pagination state
  const [page, setPage] = useState(1);


  // query function
  const { data: products, error, isLoading } = useQuery({
    queryKey: ["products", { page }],
    queryFn: retrieveProducts,
  });

  // mutation function delate for product
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (id) => axios.delete(`http://localhost:3000/products/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    }
  })
  const handleDelateProduct = (id) => {
    mutate(id)
  }

  if (isLoading) return <div>Fetching Products...</div>
  if (error) return <div>An error occured: {error.message}</div>

  return (
    <div className="flex flex-col justify-center items-center w-3/5">
      <h2 className="text-[40px] font-semibold text-green-500 my-2">Product List</h2>

      {/* product card */}
      <div className="flex flex-wrap justify-center items-center" >
        {products.data && products.data.map(product => (
          <div key={product.id} className="relative m-2 w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md">
            <a className='cursor-pointer' onClick={() => onProductId(product.id)}>
              <img
                className="h-60 rounded-t-lg object-cover"
                src={product.thumbnail}
                alt={product.title}
              />
            </a>
            <span className="absolute top-0 left-0 w-28 translate-y-4 -translate-x-6 -rotate-45 bg-black text-center text-sm text-white">
              Sale
            </span>
            <div className="mt-4 px-5 pb-5">
              <div className="flex justify-between">
                <h5 className="text-xl font-semibold tracking-tight text-slate-900">
                  {product.title}
                </h5>

                <p>
                  <span className="text-2xl font-bold text-slate-900">$ {product.price} </span>
                </p>
              </div>
              <div className="mt-2.5 mb-5 flex items-center">
                <span className="mr-2 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                  {product.rating}
                </span>
                <FaRegStar className="text-yellow-400" />

              </div>
              <div className="flex items-center justify-between">

                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    onClick={() => handleDelateProduct(product.id)}
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    onClick={() => onEditProduct(product)}
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                  >
                    <FaRegEdit />
                  </button>
                </div>

                <button
                  className="flex items-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"

                  onClick={() => onProductId(product.id)}
                >
                  Show Details
                </button>
              </div>
            </div>
          </div>

        ))}
      </div>

      {/* pagination */}
      <div className='flex py-2'>
        {
          products.prev && (
            <button
              className='p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm'
              onClick={() => setPage(products.prev)} > Prev  </button>
          )
        }
        {
          products.next && (
            <button
              className='p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm'
              onClick={() => setPage(products.next)} > Next </button>
          )
        }
      </div>

    </div>
  )
}

export default ProductList