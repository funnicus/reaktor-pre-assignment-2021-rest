import React, { useState } from 'react'

import Product from './Product'
import './App.css'
import { getProducts } from './services'

const App = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProductsFromApi = async (product) => {
      setLoading(true)
      const res = await getProducts(product)
      setLoading(false)
      setProducts(res.data)
  }

  return (
    <div className="App">
      <nav>
        <ul>
          <li key="beanies"><button onClick={() => getProductsFromApi('beanies')}>Beanies</button></li>
          <li key="gloves"><button onClick={() => getProductsFromApi('gloves')}>Gloves</button></li>
          <li key="facemasks"><button onClick={() => getProductsFromApi('facemasks')}>Facemasks</button></li>
        </ul>
      </nav>
      {products.length < 1 && !loading
       ? <span>Please select category...</span>
       : (!products.length < 1 && !loading ? products.map(p => <Product product={p} />) : <span>Loading...</span>) 
      }
    </div>
  );
}

export default App;
