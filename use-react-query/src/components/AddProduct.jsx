/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const AddProduct = ({ editProduct }) => {

    const product = editProduct;
    console.log(product)

    // query client
    const queryClient = useQueryClient();

    // initial state
    const [state, setState] = useState({
        title: "",
        description: "",
        price: 0,
        rating: 5,
        thumbnail: "",
    });

    // mutation function
    const { mutate } = useMutation({
        mutationFn: (newProduct) => axios.post("http://localhost:3000/products", newProduct),

        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
        }
    })

    // handle submit
    const submitData = (e) => {
        e.preventDefault();
        const newData = { ...state, id: crypto.randomUUID().toString() };

        // parse data mutateion object
        mutate(newData);
    }

    // handle change
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.type === "number" ? (e.target.valueAsNumber)
            : (e.target.value);
        setState({
            ...state,
            [name]: value
        })
    }

    if (mutate.isLoading) return <div>Adding Product...</div>
    if (mutate.isError) return <div>An Error Occured: {mutate.error.message}</div>

    return (
        <div className="m-2 p-2 bg-gray-100 w-1/5 h-1/2">
            <h2 className="text-2xl my-2">Add a Product</h2>

            {
                mutate.isSuccess && <div className="text-green-500">Product Added Successfully</div>
            }

            <form onSubmit={submitData} className="flex flex-col">
                <input
                    type="text"
                    value={state.title}
                    name="title"
                    onChange={handleChange}
                    className="my-2 border p-2 rounded"
                    placeholder="Enter a product title"
                />
                <textarea
                    value={state.description}
                    name="description"
                    onChange={handleChange}
                    className="my-2 border p-2 rounded"
                    placeholder="Enter a product description"
                />

                <input
                    type="number"
                    value={state.price}
                    name="price"
                    onChange={handleChange}
                    className="my-2 border p-2 rounded"
                    placeholder="Enter a product price"
                />
                <input
                    type="text"
                    value={state.thumbnail}
                    name="thumbnail"
                    onChange={handleChange}
                    className="my-2 border p-2 rounded"
                    placeholder="Enter a product thumbnail URL"
                />

                <button
                    type="submit"
                    className="bg-black m-auto text-white text-xl p-1 rounded-md"
                >
                    Add
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
