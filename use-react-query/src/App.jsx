import ProductList from "./components/ProductList"
import ProductDetails from "./components/ProductDetails"
import AddProduct from "./components/AddProduct"
import { useState } from "react"
function App() {
  // set product id state
  const [productId, setProductId] = useState(1);

  // set edit product state
  const [editProduct, setEditProduct] = useState(null);

  return (
    <div className="flex m-2">
      <AddProduct editProduct={editProduct} />
      <ProductList onProductId={setProductId} onEditProduct={setEditProduct} />
      <ProductDetails id={productId} />
    </div>
  )
}

export default App
